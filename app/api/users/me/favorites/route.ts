import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/users/me/favorites
 */
export async function GET() {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("favorites")
      .select(`venue_id, created_at, venues(id, name, location, district, rating, images, sports, review_count)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) return errorResponse(error.message, 500)

    return successResponse(data?.map((f) => ({ ...(f.venues as unknown as Record<string, unknown> | null ?? {}), savedAt: f.created_at })))
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/users/me/favorites
 * Body: { venueId }
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const { venueId } = await request.json()
    if (!venueId) return errorResponse("venueId is required", 400)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("favorites")
      .upsert({ user_id: user.id, venue_id: venueId }, { onConflict: "user_id,venue_id" })
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * DELETE /api/users/me/favorites
 * Query: venueId
 */
export async function DELETE(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get("venueId")
    if (!venueId) return errorResponse("venueId query param is required", 400)

    const supabase = createClient()
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("venue_id", venueId)

    if (error) return errorResponse(error.message, 500)

    return successResponse({ message: "Removed from favorites." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
