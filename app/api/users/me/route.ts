import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"
import { updateProfileSchema } from "@/lib/validations/auth"

/**
 * GET /api/users/me
 */
export async function GET() {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error || !profile) return errorResponse("Profile not found", 404)

    return successResponse({ email: user.email, ...profile })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * PUT /api/users/me
 * Update profile fields.
 */
export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = updateProfileSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400)

    const { fullName, phone, location, sports, fcmToken } = parsed.data

    const supabase = createClient()
    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (fullName !== undefined) updatePayload.full_name = fullName
    if (phone !== undefined) updatePayload.phone = phone
    if (location !== undefined) updatePayload.location = location
    if (sports !== undefined) updatePayload.sports = sports
    if (fcmToken !== undefined) updatePayload.fcm_token = fcmToken

    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/users/me (avatar upload)
 * Upload avatar to Supabase Storage.
 * Expects multipart/form-data with field "avatar".
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const formData = await request.formData()
    const file = formData.get("avatar") as File | null

    if (!file) return errorResponse("No avatar file provided", 400)
    if (!file.type.startsWith("image/")) return errorResponse("File must be an image", 400)
    if (file.size > 5 * 1024 * 1024) return errorResponse("Image must be smaller than 5MB", 400)

    const admin = createAdminClient()
    const ext = file.name.split(".").pop() ?? "jpg"
    const path = `avatars/${user.id}.${ext}`

    const { error: uploadError } = await admin.storage
      .from("user-content")
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) return errorResponse(uploadError.message, 500)

    const { data: urlData } = admin.storage.from("user-content").getPublicUrl(path)

    // Update profile with new avatar URL
    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    return successResponse({ avatarUrl: urlData.publicUrl })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
