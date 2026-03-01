import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the authenticated user.
 */
export async function PUT() {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) return errorResponse(error.message, 500)

    return successResponse({ message: "All notifications marked as read." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
