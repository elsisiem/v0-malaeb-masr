import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"
import { createTeamSchema } from "@/lib/validations/team"

/**
 * GET /api/teams
 * Query: tab=myTeams|discover, search, page, pageSize
 * - myTeams: teams the user belongs to
 * - discover: all public teams
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const tab = searchParams.get("tab") ?? "myTeams"
    const search = searchParams.get("search") ?? ""
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createClient()

    if (tab === "myTeams") {
      // Teams where the user is a member
      const { data: memberRows } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)

      const teamIds = (memberRows ?? []).map((r) => r.team_id)

      let query = supabase
        .from("teams")
        .select(
          `
          id, name, sport, description, image, is_public, invite_code, created_at,
          profiles!teams_captain_id_fkey(id, full_name, avatar_url),
          team_members(id, user_id, role, profiles(id, full_name, avatar_url))
        `,
          { count: "exact" },
        )
        .in("id", teamIds.length > 0 ? teamIds : ["00000000-0000-0000-0000-000000000000"])
        .range(from, to)

      if (search) query = query.ilike("name", `%${search}%`)

      const { data, error, count } = await query.order("created_at", { ascending: false })
      if (error) return errorResponse(error.message, 500)

      return successResponse({ teams: data, pagination: { page, pageSize, total: count ?? 0 } })
    } else {
      // Discover: all public teams
      let query = supabase
        .from("teams")
        .select(
          `
          id, name, sport, description, image, is_public, created_at,
          profiles!teams_captain_id_fkey(id, full_name, avatar_url),
          team_members(id, user_id)
        `,
          { count: "exact" },
        )
        .eq("is_public", true)
        .range(from, to)

      if (search) query = query.ilike("name", `%${search}%`)

      const { data, error, count } = await query.order("created_at", { ascending: false })
      if (error) return errorResponse(error.message, 500)

      return successResponse({ teams: data, pagination: { page, pageSize, total: count ?? 0 } })
    }
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/teams
 * Create a new team. The creator becomes captain.
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = createTeamSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400)

    const supabase = createClient()

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: parsed.data.name,
        sport: parsed.data.sport,
        description: parsed.data.description ?? null,
        captain_id: user.id,
        is_public: parsed.data.isPublic,
      })
      .select()
      .single()

    if (teamError) return errorResponse(teamError.message, 500)

    // Add creator as captain member
    await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "captain",
    })

    return successResponse(team, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
