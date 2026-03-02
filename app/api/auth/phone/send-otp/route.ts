import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * POST /api/auth/phone/send-otp
 * Body: { phone: "+201012345678" }
 */
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    if (!phone || typeof phone !== "string") {
      return errorResponse("Phone number is required", 400)
    }

    // Normalise: must start with +
    const normalised = phone.startsWith("+") ? phone : `+${phone}`

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalised,
    })

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse({ message: "OTP sent successfully" })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
