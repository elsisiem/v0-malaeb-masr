"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 flex items-center gap-3 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Privacy Policy</h1>
      </header>

      <main className="container p-6 space-y-6 prose prose-sm dark:prose-invert max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground">Last updated: April 2025</p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground">
            We collect information you provide when registering, booking, or using Malaeb Masr — including your name,
            email address, phone number, and payment information (processed securely via Stripe).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
          <p className="text-sm text-muted-foreground">
            Your information is used to process bookings, send notifications, personalise your experience, and improve
            our services. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. Data Security</h2>
          <p className="text-sm text-muted-foreground">
            We use industry-standard encryption and secure infrastructure (Supabase + Stripe) to protect your data.
            Passwords are never stored in plain text.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Cookies</h2>
          <p className="text-sm text-muted-foreground">
            We use essential cookies to keep you logged in and remember your preferences. No third-party tracking
            cookies are used without your consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Your Rights</h2>
          <p className="text-sm text-muted-foreground">
            You may request access to, correction of, or deletion of your personal data at any time by contacting us
            at <a href="mailto:privacy@malaebmasr.com" className="text-primary">privacy@malaebmasr.com</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">6. Changes to This Policy</h2>
          <p className="text-sm text-muted-foreground">
            We may update this Privacy Policy periodically. We will notify you of significant changes via the app or
            email.
          </p>
        </section>
      </main>
    </div>
  )
}
