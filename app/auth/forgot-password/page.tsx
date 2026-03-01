"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
      } else {
        setSent(true)
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/auth/login">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">Back to Login</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    If an account with <strong>{email}</strong> exists, a password reset link has been sent.
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
