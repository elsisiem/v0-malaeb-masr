import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"
import { createReviewSchema } from "@/lib/validations/venue"

/**
 * GET /api/venues/[id]/reviews
 * Query: page, pageSize
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "10"))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createClient()
    const { data, error, count } = await supabase
      .from("reviews")
      .select(
        `
        id, rating, comment, created_at,
        profiles(id, full_name, avatar_url)
      `,
        { count: "exact" },
      )
      .eq("venue_id", params.id)
      .range(from, to)
      .order("created_at", { ascending: false })

    if (error) return errorResponse(error.message, 500)

    return successResponse({
      reviews: data,
      pagination: { page, pageSize, total: count ?? 0 },
    })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/venues/[id]/reviews
 * Submit a review. Requires auth + at least one past booking at this venue.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()

    // Ensure user has a past/completed booking at this venue
    const { data: booking } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", user.id)
      .eq("venue_id", params.id)
      .eq("payment_status", "paid")
      .limit(1)
      .single()

    if (!booking) {
      return errorResponse("You can only review venues you have booked.", 403)
    }

    const body = await request.json()
    const parsed = createReviewSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400)

    // Upsert — one review per user per venue
    const { data, error } = await supabase
      .from("reviews")
      .upsert(
        {
          user_id: user.id,
          venue_id: params.id,
          booking_id: parsed.data.bookingId ?? booking.id,
          rating: parsed.data.rating,
          comment: parsed.data.comment ?? null,
        },
        { onConflict: "user_id,venue_id" },
      )
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
