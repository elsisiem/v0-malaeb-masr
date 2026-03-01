import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUserWithProfile, successResponse, errorResponse } from "@/lib/api-helpers"
import { createFacilitySchema } from "@/lib/validations/venue"

/**
 * GET /api/venues/[id]/facilities
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .eq("venue_id", params.id)
      .order("name")

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/venues/[id]/facilities
 * Add a facility to a venue. Owner only.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUserWithProfile(["owner", "admin"])
    if (authError) return errorResponse(authError, authError === "Unauthorized" ? 401 : 403)

    const supabase = createClient()

    // Check venue ownership
    const { data: venue } = await supabase.from("venues").select("owner_id").eq("id", params.id).single()
    if (!venue || venue.owner_id !== user!.id) return errorResponse("Forbidden", 403)

    const body = await request.json()
    const parsed = createFacilitySchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400)

    const { data, error } = await supabase
      .from("facilities")
      .insert({
        venue_id: params.id,
        name: parsed.data.name,
        type: parsed.data.type,
        description: parsed.data.description ?? null,
        capacity: parsed.data.capacity,
        price: parsed.data.price,
        equipment_included: parsed.data.equipmentIncluded,
      })
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
