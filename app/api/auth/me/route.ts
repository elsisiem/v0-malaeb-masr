import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/auth/me
 * Returns the current authenticated user + profile.
 */
export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return errorResponse("Unauthorized", 401)
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return errorResponse("Profile not found", 404)
    }

    // Count stats
    const [bookingsRes, teamsRes, favoritesRes] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ])

    return successResponse({
      email: user.email,
      ...(profile ?? {}),
      stats: {
        totalBookings: bookingsRes.count ?? 0,
        totalTeams: teamsRes.count ?? 0,
        savedVenues: favoritesRes.count ?? 0,
      },
    })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
