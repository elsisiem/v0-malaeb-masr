import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * PATCH /api/auth/update-profile
 * Body: { fullName?, phone?, avatarUrl? }
 * Updates the authenticated user's profile row.
 */
export async function PATCH(req: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await req.json().catch(() => ({}))
    const { fullName, phone, avatarUrl } = body as {
      fullName?: string
      phone?: string
      avatarUrl?: string
    }

    // Build the update payload — only include fields that were provided
    const updates: Record<string, string> = {}
    if (fullName !== undefined) updates.full_name = fullName.trim()
    if (phone !== undefined) updates.phone = phone.trim()
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl.trim()

    if (Object.keys(updates).length === 0) {
      return errorResponse("No fields to update", 400)
    }

    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single()

    if (updateError) {
      return errorResponse(updateError.message, 500)
    }

    return successResponse({ profile })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
