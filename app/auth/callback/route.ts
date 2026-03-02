import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /auth/callback
 * Handles the OAuth redirect from Supabase (Google, Apple, etc.)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next")

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      // If caller specified an explicit next, honour it
      if (next) return NextResponse.redirect(`${origin}${next}`)

      // Otherwise route by role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      const destination = profile?.role === "owner" ? "/owner" : "/dashboard"
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  // Something went wrong — send back to login with an error
  return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`)
}
