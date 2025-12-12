"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"

/** ThemeToggle
 * - safe client component using `next-themes`
 * - uses the existing `Switch` UI component
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <div className="fixed right-4 bottom-24 z-50 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-md ring-1 ring-border">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        aria-label="Toggle theme"
        checked={isDark}
        onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}
