"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, CalendarDays, Users, Bell } from "lucide-react"
import { useNotifications } from "@/components/notification-provider"

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Explore" },
  { href: "/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/teams", icon: Users, label: "Teams" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { unreadCount } = useNotifications()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (pathname.startsWith("/auth") || pathname === "/welcome") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/60 safe-area-inset">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          const isNotifications = href === "/notifications"
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 transition-colors duration-150",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Active top bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
              )}
              {/* Icon pill */}
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-colors duration-150",
                  isActive ? "bg-primary/10" : "",
                )}
              >
                {isNotifications ? (
                  <div className="relative">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                ) : (
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
              <span className={cn("text-[10px] font-medium tracking-tight", isActive ? "text-primary" : "")}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
