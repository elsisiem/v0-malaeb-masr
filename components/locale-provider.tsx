"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Locale } from "@/i18n/config"

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const router = useRouter()
  const pathname = usePathname()

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)

    // Store preference
    localStorage.setItem("preferred-locale", newLocale)

    // Update the URL
    const currentPath = pathname.replace(/^\/(en|ar)/, "")
    const newPath = newLocale === "en" ? currentPath || "/" : `/${newLocale}${currentPath || "/"}`
    router.push(newPath)
  }

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem("preferred-locale") as Locale | null
    if (saved && saved !== locale) {
      setLocaleState(saved)
    }
  }, [locale])

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return context
}
