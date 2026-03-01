"use client"

import { useState, useEffect } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  MessageSquare,
  Moon,
  Pencil,
  Plus,
  Save,
  Shield,
  Trophy,
  Users,
  X,
} from "lucide-react"

type Profile = {
  full_name: string
  email: string
  phone: string
  role: string
  stats: {
    totalBookings: number
    totalTeams: number
    savedVenues: number
  }
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setProfile({
            full_name: data.full_name ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            role: data.role ?? "player",
            stats: data.stats ?? { totalBookings: 0, totalTeams: 0, savedVenues: 0 },
          })
          setEditName(data.full_name ?? "")
          setEditPhone(data.phone ?? "")
        }
      })
      .catch(console.error)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveError("")
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: editName, phone: editPhone }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setSaveError(json.error ?? "Failed to save.")
      } else {
        setProfile((p) => p ? { ...p, full_name: editName, phone: editPhone } : p)
        setIsEditing(false)
      }
    } catch {
      setSaveError("Network error. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditName(profile?.full_name ?? "")
    setEditPhone(profile?.phone ?? "")
    setSaveError("")
    setIsEditing(false)
  }

  // Use the browser Supabase client so cookies are cleared on the client side
  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* â”€â”€ Account Card (tappable) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <button
          onClick={() => setIsEditing((v) => !v)}
          className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm hover:bg-muted/50 active:scale-[0.98] transition-transform text-left"
        >
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">{profile?.full_name || "Loadingâ€¦"}</p>
            <p className="text-sm text-muted-foreground truncate">{profile?.email || ""}</p>
            {profile?.phone && (
              <p className="text-xs text-muted-foreground mt-0.5">{profile.phone}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0">
            <Pencil className="h-4 w-4 text-muted-foreground" />
            <ChevronRight className="h-4 w-4 text-muted-foreground -mt-0.5" />
          </div>
        </button>

        {/* â”€â”€ Inline edit form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {isEditing && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">Edit Profile</h3>

              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-phone" className="text-xs">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+20 1xx xxxx xxxx"
                />
              </div>

              {saveError && (
                <p className="text-xs text-destructive">{saveError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1 gap-1.5" onClick={handleSave} disabled={saving}>
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Savingâ€¦" : "Save"}
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={handleCancelEdit} disabled={saving}>
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <CalendarDays className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{profile?.stats.totalBookings ?? "â€”"}</div>
              <div className="text-[11px] text-muted-foreground">Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{profile?.stats.totalTeams ?? "â€”"}</div>
              <div className="text-[11px] text-muted-foreground">Teams</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{profile?.stats.savedVenues ?? "â€”"}</div>
              <div className="text-[11px] text-muted-foreground">Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* â”€â”€ Payment Methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Payment Methods</h3>
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs text-primary px-2">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
              <CreditCard className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No payment methods saved</p>
              <p className="text-xs mt-0.5">Add a card to pay faster</p>
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ Account Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Account</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-muted text-sm">
                <span className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security &amp; Password
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <Separator className="my-1" />
              <button className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-muted text-sm">
                <span className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Language
                </span>
                <span className="flex items-center gap-2 text-muted-foreground text-xs">
                  English
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ Preferences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-sm">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  Notifications
                </span>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-sm">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  Dark Mode
                </span>
                <Switch
                  checked={mounted ? theme === "dark" : false}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  disabled={!mounted}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ Support â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Support</h3>
            <div className="space-y-1">
              {[
                { icon: HelpCircle, label: "Help Center" },
                { icon: MessageSquare, label: "Contact Support" },
                { icon: Info, label: "About" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-muted text-sm"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ Sign Out â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-[0.98] transition-all text-sm font-medium disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Signing outâ€¦" : "Sign Out"}
        </button>

      </main>

      <BottomNavigation />
    </div>
  )
}

