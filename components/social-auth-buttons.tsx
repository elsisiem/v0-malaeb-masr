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
      {/* Google */}
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
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Google
      </Button>

      {/* Apple */}
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
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.19.74 3.05.8.83-.13 1.67-.81 2.92-.9 1.46-.1 2.55.55 3.23 1.46-2.89 1.72-2.33 5.52.29 6.73-.6 1.67-1.45 3.33-1.49 4.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        )}
        Apple
      </Button>
    </div>
  )
}
