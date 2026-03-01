import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"
import { createBookingSchema } from "@/lib/validations/booking"

/**
 * GET /api/bookings
 * Returns the authenticated user's bookings.
 * Query: status=upcoming|past|canceled, page, pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createClient()
    let query = supabase
      .from("bookings")
      .select(
        `
        id, date, start_time, duration, player_count, price, status,
        payment_status, payment_id, transaction_id, notes,
        equipment_selected, created_at,
        venues(id, name, location, district, images),
        facilities(id, name, type, image)
      `,
        { count: "exact" },
      )
      .eq("user_id", user.id)
      .range(from, to)
      .order("date", { ascending: false })
      .order("start_time", { ascending: false })

    const VALID_STATUSES = ["upcoming", "past", "canceled", "pending", "confirmed"] as const
    type BookingStatus = typeof VALID_STATUSES[number]
    if (status && VALID_STATUSES.includes(status as BookingStatus)) {
      query = query.eq("status", status as BookingStatus)
    }

    const { data, error, count } = await query

    if (error) return errorResponse(error.message, 500)

    return successResponse({
      bookings: data,
      pagination: { page, pageSize, total: count ?? 0 },
    })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/bookings
 * Create a new booking. Payment is handled separately via /api/payments/initiate.
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = createBookingSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400)

    const supabase = createClient()
    const { venueId, facilityId, date, startTime, duration, playerCount, equipmentSelected, notes, teamId } =
      parsed.data

    // Validate facility exists and belongs to venue
    const { data: facility, error: facilityError } = await supabase
      .from("facilities")
      .select("id, venue_id, price, available, capacity")
      .eq("id", facilityId)
      .eq("venue_id", venueId)
      .single()

    if (facilityError || !facility) return errorResponse("Facility not found", 404)
    if (!facility.available) return errorResponse("This facility is not available for booking", 409)

    // Validate player count
    if (playerCount > facility.capacity) {
      return errorResponse(`Player count exceeds facility capacity of ${facility.capacity}`, 400)
    }

    // Check for conflicting bookings (same facility, same date, overlapping time)
    const startHour = parseInt(startTime.split(":")[0])
    const conflictingSlots: string[] = []
    for (let i = 0; i < duration; i++) {
      const h = (startHour + i) % 24
      conflictingSlots.push(`${String(h).padStart(2, "0")}:${startTime.split(":")[1]}`)
    }

    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id, start_time, duration")
      .eq("facility_id", facilityId)
      .eq("date", date)
      .not("status", "eq", "canceled")

    if (conflicts && conflicts.length > 0) {
      for (const conflict of conflicts) {
        const [ch] = conflict.start_time.split(":").map(Number)
        for (let i = 0; i < conflict.duration; i++) {
          const blocked = `${String((ch + i) % 24).padStart(2, "0")}:${conflict.start_time.split(":")[1]}`
          if (conflictingSlots.includes(blocked)) {
            return errorResponse("Selected time slot is already booked. Please choose a different time.", 409)
          }
        }
      }
    }

    // Calculate total price
    const totalPrice = facility.price * duration

    // Create booking with status "pending" (payment not yet done)
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        venue_id: venueId,
        facility_id: facilityId,
        team_id: teamId ?? null,
        date,
        start_time: startTime,
        duration,
        player_count: playerCount,
        equipment_selected: equipmentSelected,
        price: totalPrice,
        status: "pending",
        payment_status: "pending",
        notes: notes ?? null,
      })
      .select(
        `
        *,
        venues(id, name, location, district, images),
        facilities(id, name, type, image, price)
      `,
      )
      .single()

    if (bookingError) return errorResponse(bookingError.message, 500)

    return successResponse(booking, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
