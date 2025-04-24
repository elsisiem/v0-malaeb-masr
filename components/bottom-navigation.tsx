"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, Calendar, Users, User } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Don't show navigation on auth pages
  if (pathname.startsWith("/auth") || pathname === "/welcome") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-5 h-16">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/search"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname === "/search" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">Search</span>
        </Link>
        <Link
          href="/bookings"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname === "/bookings" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Bookings</span>
        </Link>
        <Link
          href="/teams"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname === "/teams" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">Teams</span>
        </Link>
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            pathname === "/profile" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  )
}
