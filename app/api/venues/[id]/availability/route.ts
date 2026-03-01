import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/venues/[id]/availability
 * Query: date=YYYY-MM-DD&facilityId=uuid
 *
 * Returns available time slots for a facility on the given date,
 * excluding already-booked slots.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const facilityId = searchParams.get("facilityId")

    if (!date) return errorResponse("date query parameter is required (YYYY-MM-DD)", 400)
    if (!facilityId) return errorResponse("facilityId query parameter is required", 400)

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse("Invalid date format. Use YYYY-MM-DD", 400)
    }

    const supabase = createClient()

    // Get the day of week (0=Sun … 6=Sat)
    const dayOfWeek = new Date(date).getDay()

    // Fetch recurring slots for this facility & day
    const { data: slots, error: slotsError } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("facility_id", facilityId)
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true)
      .order("start_time")

    if (slotsError) return errorResponse(slotsError.message, 500)

    // Fetch existing bookings for this facility+date that aren't canceled
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("start_time, duration")
      .eq("facility_id", facilityId)
      .eq("date", date)
      .not("status", "eq", "canceled")

    if (bookingsError) return errorResponse(bookingsError.message, 500)

    // Build set of booked hour-blocks (e.g. "09:00", "10:00")
    const bookedSlots = new Set<string>()
    for (const booking of bookings ?? []) {
      const [h, m] = booking.start_time.split(":").map(Number)
      for (let i = 0; i < booking.duration; i++) {
        const hour = (h + i) % 24
        bookedSlots.add(`${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
      }
    }

    // Build availability result per slot
    const availability = (slots ?? []).map((slot) => ({
      id: slot.id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      available: !bookedSlots.has(slot.start_time.slice(0, 5)),
    }))

    // If no configured slots, return a default 9am-11pm schedule
    if (availability.length === 0) {
      const defaultSlots = []
      for (let hour = 9; hour <= 22; hour++) {
        const start = `${String(hour).padStart(2, "0")}:00`
        const end = `${String(hour + 1).padStart(2, "0")}:00`
        defaultSlots.push({
          id: `default-${hour}`,
          startTime: start,
          endTime: end,
          available: !bookedSlots.has(start),
        })
      }
      return successResponse({ date, facilityId, slots: defaultSlots })
    }

    return successResponse({ date, facilityId, slots: availability })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
