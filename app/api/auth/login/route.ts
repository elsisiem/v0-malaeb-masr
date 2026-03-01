import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"
import { loginSchema } from "@/lib/validations/auth"

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const { email, password } = parsed.data
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return errorResponse("Invalid email or password.", 401)
      }
      if (error.message.includes("Email not confirmed")) {
        return errorResponse("Please verify your email before logging in.", 403)
      }
      return errorResponse(error.message, 401)
    }

    // Fetch the user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, role, sports, location")
      .eq("id", data.user.id)
      .single()

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        ...(profile ?? {}),
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
    })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
