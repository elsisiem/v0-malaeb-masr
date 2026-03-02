"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, CheckCircle2, Mail, Phone, ArrowLeft, Sparkles } from "lucide-react"
import { SocialAuthButtons } from "@/components/social-auth-buttons"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone")
  const [phoneValue, setPhoneValue] = useState("")
  const [otpValue, setOtpValue] = useState("")

  // Magic link state
  const [magicSent, setMagicSent] = useState(false)

  /* ── Email / password ─────────────────────────────────────── */
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Invalid email or password"); return }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Phone OTP ────────────────────────────────────────────── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneValue.trim()) { setError("Enter a valid phone number"); return }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to send OTP"); return }
      setPhoneStep("otp")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length < 6) { setError("Enter the 6-digit code"); return }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue, token: otpValue }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Invalid OTP"); return }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Magic Link ───────────────────────────────────────────── */
  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("magic-email") as string
    if (!email) { setError("Enter your email address"); return }
    setIsLoading(true)
    setError("")
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (err) { setError(err.message); return }
      setMagicSent(true)
      setSuccess(`Magic link sent to ${email}. Check your inbox!`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back button */}
      <div className="px-4 pt-12 pb-2">
        <Link href="/welcome" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
            <span className="text-primary-foreground font-bold text-2xl leading-none">M</span>
          </div>
          <span className="text-muted-foreground text-sm font-medium">Malaeb Masr</span>
        </motion.div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Social buttons */}
          <SocialAuthButtons />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium tracking-wider">or</span>
            </div>
          </div>

          {/* Error / Success banners */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                className="flex items-center gap-2 p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                className="flex items-center gap-2 p-3 mb-4 text-sm text-primary bg-primary/10 rounded-lg border border-primary/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth method tabs */}
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setError(""); setSuccess("") }}>
            <TabsList className="grid grid-cols-3 mb-5 h-10">
              <TabsTrigger value="email" className="text-xs gap-1.5">
                <Mail className="h-3.5 w-3.5" />Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="text-xs gap-1.5">
                <Phone className="h-3.5 w-3.5" />Phone
              </TabsTrigger>
              <TabsTrigger value="magic" className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />Magic
              </TabsTrigger>
            </TabsList>

            {/* Email tab */}
            <TabsContent value="email">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            {/* Phone tab */}
            <TabsContent value="phone">
              <AnimatePresence mode="wait">
                {phoneStep === "phone" ? (
                  <motion.form
                    key="phone-input"
                    onSubmit={handleSendOtp}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+20 1012345678"
                        value={phoneValue}
                        onChange={(e) => setPhoneValue(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Include country code (e.g. +20 for Egypt)</p>
                    </div>
                    <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Send OTP"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp-input"
                    onSubmit={handleVerifyOtp}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-1.5">
                      <Label>6-digit code</Label>
                      <p className="text-xs text-muted-foreground">Sent to {phoneValue}</p>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        placeholder="123456"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                        className="text-center text-xl tracking-[0.5em] font-mono"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : "Verify & Sign in"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm text-muted-foreground"
                      onClick={() => { setPhoneStep("phone"); setOtpValue(""); setError("") }}
                    >
                      Change number
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Magic Link tab */}
            <TabsContent value="magic">
              {magicSent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold">Check your inbox</p>
                  <p className="text-sm text-muted-foreground">Click the magic link we sent you to sign in instantly.</p>
                  <Button variant="ghost" className="text-sm" onClick={() => { setMagicSent(false); setSuccess("") }}>
                    Try a different email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="magic-email">Email address</Label>
                    <Input id="magic-email" name="magic-email" type="email" placeholder="your@email.com" required />
                  </div>
                  <p className="text-xs text-muted-foreground">We&apos;ll send a one-click sign-in link. No password needed.</p>
                  <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Send magic link"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
