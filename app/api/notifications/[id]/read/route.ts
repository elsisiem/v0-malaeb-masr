import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * PUT /api/notifications/[id]/read
 */
export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()

    const { data: notif } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (!notif) return errorResponse("Notification not found", 404)
    if (notif.user_id !== user.id) return errorResponse("Forbidden", 403)

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", params.id)

    if (error) return errorResponse(error.message, 500)

    return successResponse({ message: "Marked as read." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
