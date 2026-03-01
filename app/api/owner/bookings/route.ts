import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUserWithProfile, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/owner/bookings
 * All bookings for the owner's venues.
 * Query: status, venueId, date, page, pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUserWithProfile(["owner", "admin"])
    if (authError) return errorResponse(authError, authError === "Unauthorized" ? 401 : 403)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const venueId = searchParams.get("venueId")
    const date = searchParams.get("date")
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createClient()

    // Get owner's venue IDs
    let venueQuery = supabase.from("venues").select("id").eq("owner_id", user!.id)
    if (venueId) venueQuery = venueQuery.eq("id", venueId)

    const { data: venues } = await venueQuery
    const venueIds = (venues ?? []).map((v) => v.id)

    if (venueIds.length === 0) {
      return successResponse({ bookings: [], pagination: { page, pageSize, total: 0 } })
    }

    let query = supabase
      .from("bookings")
      .select(
        `
        id, date, start_time, duration, player_count, price, status, payment_status, created_at,
        venues(id, name, location),
        facilities(id, name, type),
        profiles(id, full_name, phone, avatar_url)
      `,
        { count: "exact" },
      )
      .in("venue_id", venueIds)
      .range(from, to)
      .order("date", { ascending: false })
      .order("start_time", { ascending: false })

    const VALID_STATUSES = ["upcoming", "past", "canceled", "pending", "confirmed"] as const
    type BookingStatus = typeof VALID_STATUSES[number]
    if (status && VALID_STATUSES.includes(status as BookingStatus)) query = query.eq("status", status as BookingStatus)
    if (date) query = query.eq("date", date)

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
