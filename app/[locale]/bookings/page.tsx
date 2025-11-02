"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, QrCode } from "lucide-react"
import { getBookings, type Booking } from "@/lib/mock-data"

export default function BookingsPage() {
  const t = useTranslations("bookings")
  const common = useTranslations("common")
  const [activeTab, setActiveTab] = useState("upcoming")
  const upcomingBookings = getBookings("upcoming")
  const pastBookings = getBookings("past")
  const canceledBookings = getBookings("canceled")

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <h1 className="text-xl font-bold">{t("title")}</h1>
      </header>

      <main className="container p-4">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">{t("upcoming")}</TabsTrigger>
            <TabsTrigger value="past">{t("past")}</TabsTrigger>
            <TabsTrigger value="canceled">{t("canceled")}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking: Booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.facilityName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{booking.venueName}</h3>
                          <Badge
                            variant="outline"
                            className={
                              booking.date.includes("Today")
                                ? "text-green-600 bg-green-50"
                                : booking.date.includes("Tomorrow")
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-purple-600 bg-purple-50"
                            }
                          >
                            {booking.date.includes("Today")
                              ? t("today")
                              : booking.date.includes("Tomorrow")
                                ? t("tomorrow")
                                : t("nextWeek")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.facilityName}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{booking.date}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="font-semibold">
                            {common("egp")} {booking.price}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <QrCode className="h-3 w-3 mr-1" />
                              {t("ticket")}
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/venue/${booking.venueId}`}>{t("directions")}</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border rounded-lg">
                <p className="text-muted-foreground mb-4">{t("noUpcoming")}</p>
                <Button asChild>
                  <Link href="/search">{t("findVenue")}</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking: Booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.facilityName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{booking.venueName}</h3>
                          <Badge variant="outline" className="text-gray-600 bg-gray-100">
                            {t("completed")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.facilityName}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{booking.date}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="font-semibold">
                            {common("egp")} {booking.price}
                          </div>
                          <Button variant="outline" size="sm">
                            {t("leaveReview")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-lg">
                <p className="text-muted-foreground">{t("noPast")}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {canceledBookings.length > 0 ? (
              canceledBookings.map((booking: Booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.facilityName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{booking.venueName}</h3>
                          <Badge variant="outline" className="text-red-600 bg-red-50">
                            {t("canceled")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.facilityName}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{booking.date}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="font-semibold">
                            {common("egp")} {booking.price}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/venue/${booking.venueId}`}>{t("bookAgain")}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-lg">
                <p className="text-muted-foreground">{t("noCanceled")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
