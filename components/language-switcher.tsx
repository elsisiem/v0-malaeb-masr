"use client"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { localeNames, type Locale } from "@/i18n/config"
import { Check } from "lucide-react"
import { useState } from "react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <span>{localeNames[locale]}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
          <DialogDescription>Choose your preferred language</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {Object.entries(localeNames).map(([key, name]) => (
            <Button
              key={key}
              variant={locale === key ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => handleLocaleChange(key as Locale)}
            >
              <span>{name}</span>
              {locale === key && <Check className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
