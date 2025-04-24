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

export default function DashboardPage() {
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
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container p-4 space-y-6">
        {/* Upcoming Booking */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Upcoming Booking</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image src="/placeholder.svg?height=80&width=80" alt="Football pitch" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Cairo Sports Club</h3>
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      Today
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Football Pitch #3</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="mr-3">April 23, 2025</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>5:00 PM - 6:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">Get Directions</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Filters */}
        <section className="overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              <Football className="h-4 w-4 mr-2" />
              Football
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              <Tennis className="h-4 w-4 mr-2" />
              Tennis
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              <Basketball className="h-4 w-4 mr-2" />
              Basketball
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              <Dumbbell className="h-4 w-4 mr-2" />
              Gym
            </Button>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              <Waves className="h-4 w-4 mr-2" />
              Swimming
            </Button>
          </div>
        </section>

        {/* Featured Promotions */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Special Offers</h2>
          <div className="relative rounded-lg overflow-hidden h-40">
            <Image src="/placeholder.svg?height=160&width=400" alt="Promotion" fill className="object-cover" />
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
              {/* Venue Card 1 */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/placeholder.svg?height=160&width=400"
                      alt="Football pitch"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        4.8
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Elite Sports Center</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Nasr City, 2.3 km
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">EGP 250</div>
                        <div className="text-xs text-muted-foreground">per hour</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          Football
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Tennis
                        </Badge>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Venue Card 2 */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/placeholder.svg?height=160&width=400"
                      alt="Tennis court"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        4.6
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Cairo Tennis Academy</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Maadi, 4.1 km
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">EGP 180</div>
                        <div className="text-xs text-muted-foreground">per hour</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          Tennis
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Padel
                        </Badge>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nearby">
              <div className="flex items-center justify-center h-40 border rounded-lg">
                <p className="text-muted-foreground">Loading nearby venues...</p>
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="flex items-center justify-center h-40 border rounded-lg">
                <p className="text-muted-foreground">Loading popular venues...</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}
