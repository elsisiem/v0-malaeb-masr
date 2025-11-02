import Image from "next/image"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Filter,
  MapPin,
  Star,
  Bell,
  ClubIcon as Football,
  TurtleIcon as Tennis,
  ShoppingBasketIcon as Basketball,
  Dumbbell,
  Waves,
} from "lucide-react"
import { getBookings, getVenues, type Venue } from "@/lib/mock-data"

export default function DashboardPage() {
  const upcomingBookings = getBookings("upcoming")
  const recommendedVenues = getVenues()

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Hi, Ahmed</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              Cairo, Egypt
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container p-4 space-y-6">
        {/* Upcoming Booking */}
        {upcomingBookings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Upcoming Booking</h2>
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={upcomingBookings[0].image || "/placeholder.svg"}
                      alt={upcomingBookings[0].facilityName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{upcomingBookings[0].venueName}</h3>
                      <Badge variant="outline" className="text-green-600 bg-green-50">
                        Today
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{upcomingBookings[0].facilityName}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">{upcomingBookings[0].date}</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{upcomingBookings[0].time}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{upcomingBookings[0].location}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/booking/${upcomingBookings[0].id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/venue/${upcomingBookings[0].venueId}`}>Get Directions</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Filters */}
        <section className="overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <Button variant="outline" className="rounded-full whitespace-nowrap" asChild>
              <Link href="/search?sport=football">
                <Football className="h-4 w-4 mr-2" />
                Football
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap" asChild>
              <Link href="/search?sport=tennis">
                <Tennis className="h-4 w-4 mr-2" />
                Tennis
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap" asChild>
              <Link href="/search?sport=basketball">
                <Basketball className="h-4 w-4 mr-2" />
                Basketball
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap" asChild>
              <Link href="/search?sport=gym">
                <Dumbbell className="h-4 w-4 mr-2" />
                Gym
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap" asChild>
              <Link href="/search?sport=swimming">
                <Waves className="h-4 w-4 mr-2" />
                Swimming
              </Link>
            </Button>
          </div>
        </section>

        {/* Featured Promotions */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Special Offers</h2>
          <div className="relative rounded-lg overflow-hidden h-40 hover:shadow-md transition-all">
            <Image src="/images/soccer3.jpg" alt="Promotion" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-end p-4">
              <Badge className="w-fit mb-2">Limited Time</Badge>
              <h3 className="text-white font-bold text-xl">30% Off First Booking</h3>
              <p className="text-white/80 text-sm">Use code: FIRST30</p>
            </div>
          </div>
        </section>

        {/* Recommended Venues */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recommended For You</h2>
            <Link href="/search" className="text-sm text-primary">
              View All
            </Link>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {/* Venue Cards */}
              {recommendedVenues.slice(0, 2).map((venue: Venue) => (
                <Card key={venue.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src={venue.images[0] || "/placeholder.svg"}
                        alt={venue.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {venue.rating}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{venue.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {venue.district}, {venue.distance} km
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">EGP {venue.price}</div>
                          <div className="text-xs text-muted-foreground">per hour</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-1">
                          {venue.sports.slice(0, 2).map((sport) => (
                            <Badge key={sport} variant="outline" className="text-xs">
                              {sport.charAt(0).toUpperCase() + sport.slice(1)}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/venue/${venue.id}`}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="nearby">
              <div className="space-y-4">
                {recommendedVenues
                  .sort((a, b) => a.distance - b.distance)
                  .slice(0, 2)
                  .map((venue: Venue) => (
                    <Card key={venue.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-0">
                        <div className="relative h-40 w-full">
                          <Image
                            src={venue.images[0] || "/placeholder.svg"}
                            alt={venue.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {venue.rating}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{venue.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {venue.district}, {venue.distance} km
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">EGP {venue.price}</div>
                              <div className="text-xs text-muted-foreground">per hour</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-1">
                              {venue.sports.slice(0, 2).map((sport) => (
                                <Badge key={sport} variant="outline" className="text-xs">
                                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/venue/${venue.id}`}>Book Now</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="space-y-4">
                {recommendedVenues
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 2)
                  .map((venue: Venue) => (
                    <Card key={venue.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-0">
                        <div className="relative h-40 w-full">
                          <Image
                            src={venue.images[0] || "/placeholder.svg"}
                            alt={venue.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {venue.rating}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{venue.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {venue.district}, {venue.distance} km
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">EGP {venue.price}</div>
                              <div className="text-xs text-muted-foreground">per hour</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-1">
                              {venue.sports.slice(0, 2).map((sport) => (
                                <Badge key={sport} variant="outline" className="text-xs">
                                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/venue/${venue.id}`}>Book Now</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}
