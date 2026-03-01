import { createClient } from "@/lib/supabase/server"
import { getAuthUserWithProfile, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/owner/analytics
 * Returns dashboard analytics for the owner's venues.
 */
export async function GET() {
  try {
    const { user, error: authError } = await getAuthUserWithProfile(["owner", "admin"])
    if (authError) return errorResponse(authError, authError === "Unauthorized" ? 401 : 403)

    const supabase = createClient()

    // Get all venues owned by this user
    const { data: venues } = await supabase
      .from("venues")
      .select("id, name, rating, review_count")
      .eq("owner_id", user!.id)

    const venueIds = (venues ?? []).map((v) => v.id)

    if (venueIds.length === 0) {
      return successResponse({
        totalRevenue: 0,
        totalBookings: 0,
        averageRating: 0,
        occupancyRate: 0,
        venues: [],
        recentBookings: [],
        monthlyRevenue: [],
      })
    }

    // Total bookings + revenue
    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, price, status, payment_status, date, created_at")
      .in("venue_id", venueIds)
      .not("status", "eq", "canceled")

    const paidBookings = (bookings ?? []).filter((b) => b.payment_status === "paid")
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.price, 0)
    const totalBookings = bookings?.length ?? 0

    // Average rating across venues
    const avgRating =
      venues && venues.length > 0
        ? venues.reduce((sum, v) => sum + v.rating, 0) / venues.length
        : 0

    // Monthly revenue — last 6 months
    const monthlyRevenue: { month: string; revenue: number; bookings: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthStr = d.toISOString().slice(0, 7) // "YYYY-MM"
      const monthBookings = paidBookings.filter((b) => b.date.startsWith(monthStr))
      monthlyRevenue.push({
        month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        revenue: monthBookings.reduce((sum, b) => sum + b.price, 0),
        bookings: monthBookings.length,
      })
    }

    // Per-venue occupancy (last 30 days) — simplified: booked hours / (available hours per day * 30)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select(
        `
        id, date, start_time, duration, price, status, payment_status, created_at,
        venues(id, name),
        facilities(id, name, type),
        profiles(id, full_name, phone)
      `,
      )
      .in("venue_id", venueIds)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: false })
      .limit(20)

    return successResponse({
      totalRevenue,
      totalBookings,
      averageRating: parseFloat(avgRating.toFixed(2)),
      occupancyRate: totalBookings > 0 ? Math.min(99, Math.round((paidBookings.length / totalBookings) * 100)) : 0,
      venues,
      recentBookings,
      monthlyRevenue,
    })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
