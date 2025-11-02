"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Home, Search, Calendar, Users, Bell } from "lucide-react"
import { useNotifications } from "@/components/notification-provider"
import { Badge } from "@/components/ui/badge"

export function BottomNavigation() {
  const pathname = usePathname()
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const { unreadCount } = useNotifications()
  const t = useTranslations("navigation")

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Don't show navigation on auth pages
  if (pathname.includes("/auth") || pathname.includes("/welcome")) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-5 h-16">
        <Link
          href={`/${locale}/dashboard`}
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname.includes("/dashboard") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">{t("home")}</span>
        </Link>
        <Link
          href={`/${locale}/search`}
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname.includes("/search") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">{t("search")}</span>
        </Link>
        <Link
          href={`/${locale}/bookings`}
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname.includes("/bookings") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs">{t("bookings")}</span>
        </Link>
        <Link
          href={`/${locale}/teams`}
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname.includes("/teams") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">{t("teams")}</span>
        </Link>
        <Link
          href={`/${locale}/profile`}
          className={cn(
            "flex flex-col items-center justify-center space-y-1 relative",
            pathname.includes("/profile") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </div>
          <span className="text-xs">{t("profile")}</span>
        </Link>
      </div>
    </div>
  )
}
