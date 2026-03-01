import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse({ message: "Logged out successfully." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
