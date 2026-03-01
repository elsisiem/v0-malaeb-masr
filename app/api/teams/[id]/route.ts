import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"
import { updateTeamSchema } from "@/lib/validations/team"

/**
 * GET /api/teams/[id]
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        profiles!teams_captain_id_fkey(id, full_name, avatar_url),
        team_members(
          id, role, joined_at,
          profiles(id, full_name, avatar_url)
        )
      `,
      )
      .eq("id", params.id)
      .single()

    if (error || !data) return errorResponse("Team not found", 404)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * PUT /api/teams/[id]
 * Update team details. Captain only.
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { data: team } = await supabase.from("teams").select("captain_id").eq("id", params.id).single()
    if (!team) return errorResponse("Team not found", 404)
    if (team.captain_id !== user.id) return errorResponse("Forbidden — only the captain can update the team", 403)

    const body = await request.json()
    const parsed = updateTeamSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400)

    const { data, error } = await supabase
      .from("teams")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * DELETE /api/teams/[id]
 * Delete a team. Captain only.
 */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { data: team } = await supabase.from("teams").select("captain_id").eq("id", params.id).single()
    if (!team) return errorResponse("Team not found", 404)
    if (team.captain_id !== user.id) return errorResponse("Forbidden", 403)

    const { error } = await supabase.from("teams").delete().eq("id", params.id)
    if (error) return errorResponse(error.message, 500)

    return successResponse({ message: "Team deleted." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
