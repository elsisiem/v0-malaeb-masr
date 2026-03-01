import { createClient } from "@/lib/supabase/server"
import { getAuthUserWithProfile, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/owner/venues
 * List all venues owned by the authenticated owner.
 */
export async function GET() {
  try {
    const { user, error: authError } = await getAuthUserWithProfile(["owner", "admin"])
    if (authError) return errorResponse(authError, authError === "Unauthorized" ? 401 : 403)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("venues")
      .select(
        `
        *,
        facilities(id, name, type, price, available),
        bookings(id, status, payment_status)
      `,
      )
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false })

    if (error) return errorResponse(error.message, 500)

    // Annotate each venue with derived stats
    const enriched = (data ?? []).map((venue) => {
      const allBookings = (venue.bookings as unknown) as Array<{ status: string; payment_status: string }>
      const totalBookings = allBookings.length
      const confirmedBookings = allBookings.filter((b) => b.status === "confirmed" || b.status === "upcoming").length
      return {
        ...(venue as Record<string, unknown>),
        totalBookings,
        confirmedBookings,
        bookings: undefined, // remove raw booking list from response
      }
    })

    return successResponse(enriched)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
