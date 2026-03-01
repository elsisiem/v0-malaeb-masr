import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, createNotification, successResponse, errorResponse } from "@/lib/api-helpers"
import { joinTeamSchema } from "@/lib/validations/team"

/**
 * POST /api/teams/[id]/join
 * Body: { inviteCode }
 * Join a team using the invite code (for private teams) or directly (for public teams).
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()

    const { data: team } = await supabase
      .from("teams")
      .select("id, name, captain_id, invite_code, is_public")
      .eq("id", params.id)
      .single()

    if (!team) return errorResponse("Team not found", 404)

    // Check already a member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", params.id)
      .eq("user_id", user.id)
      .single()

    if (existingMember) return errorResponse("You are already a member of this team.", 409)

    // Verify invite code for private teams
    if (!team.is_public) {
      const body = await request.json()
      const parsed = joinTeamSchema.safeParse(body)
      if (!parsed.success) return errorResponse("Invite code is required for private teams.", 400)
      if (parsed.data.inviteCode !== team.invite_code) return errorResponse("Invalid invite code.", 400)
    }

    const { error } = await supabase.from("team_members").insert({
      team_id: params.id,
      user_id: user.id,
      role: "member",
    })

    if (error) return errorResponse(error.message, 500)

    // Notify captain
    await createNotification(
      team.captain_id,
      "New team member! 🎉",
      `A new player has joined your team "${team.name}".`,
      "team",
      { teamId: params.id, newMemberId: user.id },
    )

    return successResponse({ message: `Successfully joined team "${team.name}".` }, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
