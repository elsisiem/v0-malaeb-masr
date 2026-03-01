"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Bell, Calendar, CreditCard, User } from "lucide-react"
import Link from "next/link"

interface ApiNotification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  action_url: string | null
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then(({ data }) => setNotifications(data?.notifications ?? []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
    // Mark all as read on mount
    fetch("/api/notifications/read-all", { method: "PUT" }).catch(() => {})
  }, [])

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    await fetch(`/api/notifications/${id}/read`, { method: "PUT" }).catch(() => {})
  }

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    await fetch("/api/notifications/read-all", { method: "PUT" }).catch(() => {})
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "booking": return <Calendar className="h-5 w-5 text-primary" />
      case "payment": return <CreditCard className="h-5 w-5 text-primary" />
      case "team":    return <User className="h-5 w-5 text-primary" />
      default:        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Notifications</h1>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </header>

      <main className="container p-4 space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`cursor-pointer ${n.is_read ? "opacity-70" : ""}`}
              onClick={() => {
                markAsRead(n.id)
                if (n.action_url) router.push(n.action_url)
              }}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{n.title}</h3>
                    {!n.is_read && <Badge variant="default" className="h-2 w-2 rounded-full p-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border rounded-lg">
            <Bell className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No notifications yet</p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
