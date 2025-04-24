"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Info,
  MapPin,
  Share,
  Star,
  Users,
  ParkingMeterIcon as Parking,
  ShowerHeadIcon as Shower,
  Coffee,
  Wifi,
  Navigation,
} from "lucide-react"
import { getVenueById } from "@/lib/mock-data"
import { MapView } from "@/components/map-view"
import { venueToMapMarkers } from "@/lib/map-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VenuePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const venue = getVenueById(params.id)

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-bold mb-4">Venue not found</h1>
        <p className="text-muted-foreground mb-6">The venue you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/search")}>Back to Search</Button>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLiked(!liked)}>
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main>
        {/* Venue Gallery */}
        <div className="relative h-64 w-full">
          <Image
            src={venue.images[activeTab] || venue.images[0]}
            alt={venue.name}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute bottom-4 right-4">
            <div className="flex gap-1">
              {venue.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeTab === index ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setActiveTab(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Venue Info */}
        <div className="container p-4 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{venue.name}</h1>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{venue.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">({venue.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {venue.location}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {venue.amenities.map((amenity, index) => {
                let Icon = Parking
                if (amenity === "Showers") Icon = Shower
                if (amenity === "Café") Icon = Coffee
                if (amenity === "WiFi") Icon = Wifi

                return (
                  <div key={index} className="flex items-center p-2 border rounded-md">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-sm text-muted-foreground">{venue.description}</p>
          </div>

          {/* Available Facilities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Available Facilities</h2>
              <Button variant="ghost" size="sm" className="text-primary flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <Tabs defaultValue={venue.sports[0]}>
              <TabsList className="mb-4">
                {venue.sports.map((sport) => (
                  <TabsTrigger key={sport} value={sport}>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {venue.sports.map((sport) => (
                <TabsContent key={sport} value={sport} className="space-y-4">
                  {venue.facilities
                    .filter((facility) => facility.type === sport)
                    .map((facility) => (
                      <Card key={facility.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={facility.image || "/placeholder.svg"}
                                alt={facility.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{facility.name}</h3>
                                <Badge
                                  variant="outline"
                                  className={
                                    facility.available ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                                  }
                                >
                                  {facility.available ? "Available" : "Booked"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{facility.description}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <Users className="h-3 w-3 mr-1" />
                                <span className="mr-3">{facility.capacity} players max</span>
                                {facility.equipmentIncluded && (
                                  <>
                                    <Info className="h-3 w-3 mr-1" />
                                    <span>Equipment included</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="font-semibold">
                                  EGP {facility.price} <span className="text-xs text-muted-foreground">/ hour</span>
                                </div>
                                <Button size="sm" disabled={!facility.available} asChild>
                                  <Link href={`/booking/${venue.id}?facility=${facility.id}`}>Book Now</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Available Time Slots */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Available Time Slots</h2>
            <div className="space-y-4">
              <div className="flex overflow-x-auto pb-2 gap-2">
                {["Today", "Tomorrow", "Wed, 25 Apr", "Thu, 26 Apr", "Fri, 27 Apr"].map((day, index) => (
                  <Button key={index} variant={index === 0 ? "default" : "outline"} className="whitespace-nowrap">
                    {day}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {venue.availableTimes.map((time, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={index === 4 ? "bg-primary/10 border-primary text-primary" : ""}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Reviews</h2>
              <Button variant="ghost" size="sm" className="text-primary flex items-center">
                View All ({venue.reviewCount})
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {venue.reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        {review.userImage ? (
                          <AvatarImage src={review.userImage || "/placeholder.svg"} alt={review.userName} />
                        ) : (
                          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            <MapView markers={venueToMapMarkers([venue])} height="200px" className="mb-2" />
            <p className="text-sm text-muted-foreground">123 Sports Street, {venue.location}</p>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </div>

          {/* Book Now Button */}
          <div className="pt-4">
            <Button className="w-full" size="lg" asChild>
              <Link href={`/booking/${venue.id}`}>Book Now</Link>
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
