"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, Star, MapPin } from "lucide-react"
import { getVenues, type Venue } from "@/lib/mock-data"

export default function SearchPage() {
  const t = useTranslations("search")
  const common = useTranslations("common")
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = useState("")
  const venues = getVenues()

  const filteredVenues = venues.filter((venue) => venue.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <h1 className="text-xl font-bold mb-4">{t("title")}</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container p-4">
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredVenues.length} {t("resultsFound")}
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
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{venue.location}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {venue.sports?.slice(0, 2).map((sport) => (
                          <Badge key={sport} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
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
      </main>

      <BottomNavigation />
    </div>
  )
}
