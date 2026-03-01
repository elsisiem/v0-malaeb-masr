import { type NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createNotification } from "@/lib/api-helpers"
import { stripe } from "@/lib/stripe"

/**
 * GET /api/payments/verify
 *
 * Stripe redirects here after the user completes (or cancels) payment.
 * This is the `return_url` you pass to stripe.confirmPayment() on the frontend.
 *
 * Stripe appends:
 *   ?payment_intent=pi_xxx
 *   &payment_intent_client_secret=pi_xxx_secret_yyy
 *   &redirect_status=succeeded | failed | canceled
 *
 * We retrieve the PaymentIntent from Stripe to confirm status (never trust URL params alone),
 * then redirect the user to the appropriate page.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get("payment_intent")
    const redirectStatus = searchParams.get("redirect_status")
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

    if (!paymentIntentId) {
      return Response.redirect(`${appUrl}/bookings?error=missing_payment_intent`)
    }

    // Always verify with Stripe directly — don't trust URL params alone
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    const bookingId = paymentIntent.metadata?.bookingId

    if (!bookingId) {
      return Response.redirect(`${appUrl}/bookings?error=missing_booking`)
    }

    const admin = createAdminClient()

    if (paymentIntent.status === "succeeded") {
      // Update booking — webhook may have already done this, but this is a safe backup
      const { data: booking } = await admin
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          transaction_id: paymentIntent.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select("user_id, venues(name)")
        .single()

      if (booking) {
        await createNotification(
          booking.user_id,
          "Booking Confirmed! 🎉",
          `Your booking at ${(booking.venues as unknown as { name: string })?.name} is confirmed.`,
          "payment",
          { bookingId },
        )
      }

      return Response.redirect(`${appUrl}/bookings?success=true&bookingId=${bookingId}`)
    } else {
      // Payment failed or was canceled
      await admin
        .from("bookings")
        .update({
          payment_status: redirectStatus === "canceled" ? "failed" : "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)

      return Response.redirect(`${appUrl}/bookings?error=payment_failed&bookingId=${bookingId}`)
    }
  } catch (err) {
    console.error("[payments/verify]", err)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""
    return Response.redirect(`${appUrl}/bookings?error=server_error`)
  }
}
