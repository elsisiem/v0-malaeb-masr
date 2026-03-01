import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/notifications
 * Query: unreadOnly=true, page, pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "30"))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createClient()
    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .range(from, to)
      .order("created_at", { ascending: false })

    if (unreadOnly) query = query.eq("is_read", false)

    const { data, error, count } = await query

    if (error) return errorResponse(error.message, 500)

    // Return unread count alongside
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    return successResponse({
      notifications: data,
      unreadCount: unreadCount ?? 0,
      pagination: { page, pageSize, total: count ?? 0 },
    })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
