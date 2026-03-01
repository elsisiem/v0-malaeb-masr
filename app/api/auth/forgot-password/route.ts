import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * POST /api/auth/forgot-password
 * Sends a password-reset email via Supabase.
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return errorResponse("Email is required", 400)
    }

    const supabase = createClient()
    const redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
        : `${request.nextUrl.origin}/auth/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    })

    // Always return success to avoid email enumeration attacks
    if (error) {
      console.error("Reset password error:", error.message)
    }

    return successResponse({ message: "If an account with that email exists, a reset link has been sent." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
