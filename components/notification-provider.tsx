"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Bell } from "lucide-react"

type NotificationType = "booking" | "payment" | "team" | "system"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  date: string
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "date">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter((n) => !n.read).length

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      // Add some initial notifications for demo purposes
      setNotifications([
        {
          id: "1",
          type: "booking",
          title: "Booking Confirmed",
          message: "Your booking at Cairo Sports Club has been confirmed for today at 5:00 PM.",
          read: false,
          date: new Date().toISOString(),
          actionUrl: "/bookings",
        },
        {
          id: "2",
          type: "team",
          title: "Team Invitation",
          message: "You have been invited to join Cairo Eagles FC.",
          read: true,
          date: new Date(Date.now() - 86400000).toISOString(),
          actionUrl: "/teams",
        },
      ])
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "read" | "date">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      date: new Date().toISOString(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      action: notification.actionUrl ? (
        <ToastAction altText="View" onClick={() => (window.location.href = notification.actionUrl!)}>
          View
        </ToastAction>
      ) : undefined,
      icon: <Bell className="h-4 w-4" />,
    })

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      // Only update if there are unread notifications
      const hasUnread = prev.some((notification) => !notification.read)
      if (!hasUnread) return prev

      return prev.map((notification) => ({ ...notification, read: true }))
    })
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
