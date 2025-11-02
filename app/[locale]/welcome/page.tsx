"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function WelcomePage() {
  const t = useTranslations("welcome")
  const common = useTranslations("common")

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[60vh] w-full">
        <Image src="/images/soccer4.jpg" alt="Sports facility" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="flex-1 px-6 pt-8 pb-12 flex flex-col justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="space-y-4 mt-8">
          <Button asChild className="w-full" size="lg">
            <Link href="/auth/login">{t("loginButton")}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
            <Link href="/auth/register">{t("registerButton")}</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-between" size="lg" asChild>
            <Link href="/dashboard">
              {t("guestButton")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
