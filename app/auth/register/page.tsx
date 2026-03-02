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
import { AlertCircle, Loader2, Mail, Phone, ArrowLeft } from "lucide-react"
import { SocialAuthButtons } from "@/components/social-auth-buttons"

export default function RegisterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone")
  const [phoneValue, setPhoneValue] = useState("")
  const [phoneNameValue, setPhoneNameValue] = useState("")
  const [otpValue, setOtpValue] = useState("")

  /* ── Email / password sign-up ─────────────────────────────── */
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    if (password !== confirmPassword) { setError("Passwords do not match"); setIsLoading(false); return }
    if (password.length < 8) { setError("Password must be at least 8 characters"); setIsLoading(false); return }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Registration failed. Please try again."); return }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Phone OTP sign-up ────────────────────────────────────── */
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
      router.push("/auth/create-profile")
      router.refresh()
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
            <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground text-sm mt-1">Start booking sports venues in seconds</p>
          </div>

          {/* Social sign-up */}
          <SocialAuthButtons />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium tracking-wider">or</span>
            </div>
          </div>

          {/* Error banner */}
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
          </AnimatePresence>

          {/* Auth method tabs */}
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setError("") }}>
            <TabsList className="grid grid-cols-2 mb-5 h-10">
              <TabsTrigger value="email" className="text-xs gap-1.5">
                <Mail className="h-3.5 w-3.5" />Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="text-xs gap-1.5">
                <Phone className="h-3.5 w-3.5" />Phone
              </TabsTrigger>
            </TabsList>

            {/* Email tab */}
            <TabsContent value="email">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" type="text" placeholder="Ahmed Mohamed" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Min. 8 characters" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</> : "Create Account"}
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
                      <Label htmlFor="phone-name">Full name</Label>
                      <Input
                        id="phone-name"
                        type="text"
                        placeholder="Ahmed Mohamed"
                        value={phoneNameValue}
                        onChange={(e) => setPhoneNameValue(e.target.value)}
                        required
                      />
                    </div>
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
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : "Verify & Create Account"}
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
          </Tabs>

          <p className="text-xs text-center text-muted-foreground mt-5">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">Terms</Link>
            {" & "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</Link>
          </p>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline underline-offset-4">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
