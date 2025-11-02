"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, MapPin, Search, Star } from "lucide-react"
import { getVenues, type Venue } from "@/lib/mock-data"

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const common = useTranslations("common")
  const locale = useLocale()
  const [activeFilter, setActiveFilter] = useState("all")
  const venues = getVenues()

  const filteredVenues = venues.filter((venue) => {
    if (activeFilter === "all") return true
    if (activeFilter === "nearby") return venue.distance && Number.parseFloat(venue.distance) < 5
    if (activeFilter === "popular") return venue.rating >= 4.5
    return true
  })

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{t("greeting")}</h1>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {t("location")}
            </p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/notifications`}>
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button variant="outline" className="w-full justify-start pl-10 bg-transparent" asChild>
            <Link href={`/${locale}/search`}>{common("search")}</Link>
          </Button>
        </div>
      </header>

      <main className="container p-4 space-y-6">
        {/* Upcoming Booking Card */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{t("upcomingBooking")}</h3>
              <Badge variant="secondary">{t("today")}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm">Cairo Sports Club - Football Pitch A</p>
              <div className="flex items-center text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Today, 6:00 PM - 7:00 PM</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="secondary" className="flex-1">
                  {t("viewDetails")}
                </Button>
                <Button size="sm" variant="secondary" className="flex-1">
                  {t("getDirections")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Offers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">{t("specialOffers")}</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              {common("viewAll")}
            </Button>
          </div>
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">
                {t("limitedTime")}
              </Badge>
              <h3 className="text-xl font-bold mb-1">{t("firstBookingOffer")}</h3>
              <p className="text-sm opacity-90">{t("promoCode")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Venues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">{t("recommendedForYou")}</h2>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              {t("all")}
            </Button>
            <Button
              variant={activeFilter === "nearby" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("nearby")}
            >
              {t("nearby")}
            </Button>
            <Button
              variant={activeFilter === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("popular")}
            >
              {t("popular")}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredVenues.map((venue: Venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{venue.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{venue.rating}</span>
                          <span className="mx-1">•</span>
                          <span>{venue.location}</span>
                          {venue.distance && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{venue.distance} km</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="font-semibold">
                          {common("egp")} {venue.price}
                        </div>
                        <div className="text-xs text-muted-foreground">{common("perHour")}</div>
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm" asChild>
                      <Link href={`/${locale}/venue/${venue.id}`}>{common("bookNow")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
