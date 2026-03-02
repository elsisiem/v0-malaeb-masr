"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SocialAuthButtonsProps {
  redirectTo?: string
}

export function SocialAuthButtons({ redirectTo = "/dashboard" }: SocialAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const signInWithGoogle = async () => {
    setLoading("google")
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${redirectTo}`,
      },
    })
  }

  const signInWithApple = async () => {
    setLoading("apple")
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${origin}/auth/callback?next=${redirectTo}`,
      },
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Google — monochrome currentColor */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 font-medium border-border/60"
        onClick={signInWithGoogle}
        disabled={!!loading}
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
          </svg>
        )}
        Google
      </Button>

      {/* Apple — monochrome currentColor */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 font-medium border-border/60"
        onClick={signInWithApple}
        disabled={!!loading}
      >
        {loading === "apple" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
          </svg>
        )}
        Apple
      </Button>
    </div>
  )
}
