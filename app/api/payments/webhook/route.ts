import { type NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createNotification, successResponse, errorResponse } from "@/lib/api-helpers"
import { constructStripeEvent } from "@/lib/stripe"
import type Stripe from "stripe"

/**
 * POST /api/payments/webhook
 *
 * Stripe calls this URL after every payment event.
 * Configure in: Stripe Dashboard → Developers → Webhooks → Add endpoint
 * URL: https://YOUR_DOMAIN.vercel.app/api/payments/webhook
 * Events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
 *
 * IMPORTANT: Must be publicly accessible (no auth middleware).
 * IMPORTANT: Read body as raw text — do NOT parse JSON first (needed for sig verification).
 */
export async function POST(request: NextRequest) {
  try {
    // Stripe requires the raw request body string for HMAC signature verification
    const rawBody = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) return errorResponse("Missing stripe-signature header", 400)

    let event: Stripe.Event
    try {
      event = constructStripeEvent(rawBody, signature)
    } catch (err) {
      console.error("[webhook] Stripe signature verification failed", err)
      return errorResponse("Invalid Stripe signature", 401)
    }

    const admin = createAdminClient()

    // ── payment_intent.succeeded ──────────────────────────────────────
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const bookingId = paymentIntent.metadata?.bookingId

      if (!bookingId) {
        // Not a booking payment — ignore but acknowledge so Stripe doesn't retry
        return successResponse({ received: true })
      }

      const { data: booking, error } = await admin
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

      if (error) {
        console.error("[webhook] DB update failed", error)
        return errorResponse("DB update failed", 500)
      }

      await createNotification(
        booking.user_id,
        "Booking Confirmed! 🎉",
        `Your booking at ${(booking.venues as unknown as { name: string })?.name} is confirmed. See you on the pitch!`,
        "payment",
        { bookingId, paymentIntentId: paymentIntent.id },
      )
    }

    // ── payment_intent.payment_failed ─────────────────────────────────
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const bookingId = paymentIntent.metadata?.bookingId

      if (bookingId) {
        await admin
          .from("bookings")
          .update({ payment_status: "failed", updated_at: new Date().toISOString() })
          .eq("id", bookingId)
      }
    }

    // ── charge.refunded ───────────────────────────────────────────────
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string | null

      if (paymentIntentId) {
        const { data: booking } = await admin
          .from("bookings")
          .update({ payment_status: "refunded", updated_at: new Date().toISOString() })
          .eq("payment_id", paymentIntentId)
          .select("user_id, venues(name)")
          .single()

        if (booking) {
          await createNotification(
            booking.user_id,
            "Payment Refunded",
            `Your payment at ${(booking.venues as unknown as { name: string })?.name} has been refunded.`,
            "payment",
            { paymentIntentId },
          )
        }
      }
    }

    // Stripe expects a 200 to acknowledge receipt
    return successResponse({ received: true })
  } catch (err) {
    console.error("[payments/webhook]", err)
    return errorResponse("Webhook processing failed", 500)
  }
}
