import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * POST /api/auth/phone/verify-otp
 * Body: { phone: "+201012345678", token: "123456" }
 */
export async function POST(request: NextRequest) {
  try {
    const { phone, token } = await request.json()
    if (!phone || !token) {
      return errorResponse("Phone and OTP token are required", 400)
    }

    const normalised = phone.startsWith("+") ? phone : `+${phone}`

    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalised,
      token,
      type: "sms",
    })

    if (error) {
      return errorResponse("Invalid or expired OTP. Please try again.", 401)
    }

    // Fetch or create profile
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, phone, avatar_url, role")
        .eq("id", data.user.id)
        .single()

      return successResponse({
        user: {
          id: data.user.id,
          phone: data.user.phone,
          ...(profile ?? {}),
        },
        session: {
          accessToken: data.session?.access_token,
          refreshToken: data.session?.refresh_token,
          expiresAt: data.session?.expires_at,
        },
      })
    }

    return successResponse({ message: "Verified" })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
