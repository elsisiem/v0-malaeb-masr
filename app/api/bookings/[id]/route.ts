import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, createNotification, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/bookings/[id]
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        venues(id, name, location, district, lat, lng, images, amenities),
        facilities(id, name, type, description, image, price, equipment_included),
        teams(id, name, sport)
      `,
      )
      .eq("id", params.id)
      .eq("user_id", user.id) // RLS also enforces this, but be explicit
      .single()

    if (error || !data) return errorResponse("Booking not found", 404)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * PATCH /api/bookings/[id]
 * Cancel a booking. Only the booking owner can cancel.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()

    const { data: booking } = await supabase
      .from("bookings")
      .select("id, user_id, status, date, start_time, payment_status, price, venues(name)")
      .eq("id", params.id)
      .single()

    if (!booking) return errorResponse("Booking not found", 404)
    if (booking.user_id !== user.id) return errorResponse("Forbidden", 403)
    if (booking.status === "canceled") return errorResponse("Booking is already canceled", 400)
    if (booking.status === "past") return errorResponse("Cannot cancel a past booking", 400)

    // Check cancellation window: at least 2 hours before the booking
    const bookingDateTime = new Date(`${booking.date}T${booking.start_time}`)
    const now = new Date()
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursUntilBooking < 2) {
      return errorResponse("Cancellations must be made at least 2 hours before the booking time.", 400)
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) return errorResponse(error.message, 500)

    // TODO: Trigger Paymob refund if payment_status === "paid"
    // For now, flag for manual review

    // Send notification
    await createNotification(
      user.id,
      "Booking Canceled",
      `Your booking at ${(booking.venues as unknown as { name: string })?.name} has been canceled.`,
      "booking",
      { bookingId: params.id },
    )

    return successResponse({ message: "Booking canceled successfully." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
