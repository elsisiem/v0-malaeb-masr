import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, createNotification, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/teams/[id]/members
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("team_members")
      .select(
        `
        id, role, joined_at,
        profiles(id, full_name, avatar_url, sports)
      `,
      )
      .eq("team_id", params.id)
      .order("role", { ascending: true }) // captain first
      .order("joined_at", { ascending: true })

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * DELETE /api/teams/[id]/members
 * Body: { userId } — captain removes a member, or a member removes themselves.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { userId } = body

    if (!userId) return errorResponse("userId is required", 400)

    const supabase = createClient()

    // Must be the target user OR the team captain
    const { data: team } = await supabase.from("teams").select("captain_id").eq("id", params.id).single()
    if (!team) return errorResponse("Team not found", 404)

    const isSelf = userId === user.id
    const isCaptain = team.captain_id === user.id

    if (!isSelf && !isCaptain) return errorResponse("Forbidden", 403)
    if (userId === team.captain_id) return errorResponse("Cannot remove the captain. Transfer captaincy first.", 400)

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", params.id)
      .eq("user_id", userId)

    if (error) return errorResponse(error.message, 500)

    // Notify removed member if removed by captain
    if (isCaptain && !isSelf) {
      const { data: teamData } = await supabase.from("teams").select("name").eq("id", params.id).single()
      await createNotification(
        userId,
        "Removed from team",
        `You have been removed from team "${teamData?.name}".`,
        "team",
        { teamId: params.id },
      )
    }

    return successResponse({ message: "Member removed." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
