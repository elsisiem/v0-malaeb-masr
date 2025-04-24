"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Calendar, CreditCard, User } from "lucide-react"
import { useNotifications } from "@/components/notification-provider"
import Link from "next/link"

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  // Mark all as read when the page is loaded
  useEffect(() => {
    markAllAsRead()
  }, [markAllAsRead])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-primary" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-primary" />
      case "team":
        return <User className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
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
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "opacity-70" : ""}
              onClick={() => {
                markAsRead(notification.id)
                if (notification.actionUrl) {
                  router.push(notification.actionUrl)
                }
              }}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    {!notification.read && <Badge variant="default" className="h-2 w-2 rounded-full p-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.date).toLocaleString()}
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
