"use client"

import { useState } from "react"
import Image from "next/image"
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
  User,
} from "lucide-react"

export default function VenuePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)

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
          <Image src="/placeholder.svg?height=240&width=400&text=Venue" alt="Venue" fill className="object-cover" />
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-background/80 backdrop-blur-sm">
              <span className="text-xs">View all photos</span>
            </Badge>
          </div>
        </div>

        {/* Venue Info */}
        <div className="container p-4 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Cairo Sports Club</h1>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">4.8</span>
                <span className="text-sm text-muted-foreground ml-1">(124)</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              Nasr City, Cairo
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center p-2 border rounded-md">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Parking className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Free Parking</span>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Shower className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Showers</span>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Coffee className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Café</span>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Wifi className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Free WiFi</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-sm text-muted-foreground">
              Cairo Sports Club offers premium sports facilities in the heart of Nasr City. Our venue features
              professional-grade football pitches, tennis courts, and more, all maintained to the highest standards.
            </p>
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

            <Tabs defaultValue="football">
              <TabsList className="mb-4">
                <TabsTrigger value="football">Football</TabsTrigger>
                <TabsTrigger value="tennis">Tennis</TabsTrigger>
                <TabsTrigger value="basketball">Basketball</TabsTrigger>
              </TabsList>

              <TabsContent value="football" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=80&width=80&text=Pitch"
                          alt="Football pitch"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Football Pitch #1</h3>
                          <Badge variant="outline" className="text-green-600 bg-green-50">
                            Available
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">5-a-side, Artificial Turf</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Users className="h-3 w-3 mr-1" />
                          <span className="mr-3">10 players max</span>
                          <Info className="h-3 w-3 mr-1" />
                          <span>Equipment included</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="font-semibold">
                            EGP 250 <span className="text-xs text-muted-foreground">/ hour</span>
                          </div>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=80&width=80&text=Pitch"
                          alt="Football pitch"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Football Pitch #2</h3>
                          <Badge variant="outline" className="text-green-600 bg-green-50">
                            Available
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">7-a-side, Natural Grass</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Users className="h-3 w-3 mr-1" />
                          <span className="mr-3">14 players max</span>
                          <Info className="h-3 w-3 mr-1" />
                          <span>Equipment included</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="font-semibold">
                            EGP 350 <span className="text-xs text-muted-foreground">/ hour</span>
                          </div>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tennis">
                <div className="flex items-center justify-center h-40 border rounded-lg">
                  <p className="text-muted-foreground">Loading tennis courts...</p>
                </div>
              </TabsContent>

              <TabsContent value="basketball">
                <div className="flex items-center justify-center h-40 border rounded-lg">
                  <p className="text-muted-foreground">Loading basketball courts...</p>
                </div>
              </TabsContent>
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
                {[
                  "9:00 AM",
                  "10:00 AM",
                  "11:00 AM",
                  "12:00 PM",
                  "1:00 PM",
                  "2:00 PM",
                  "3:00 PM",
                  "4:00 PM",
                  "5:00 PM",
                ].map((time, index) => (
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
                View All (124)
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Ahmed M.</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < 5 ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Great facilities and friendly staff. The football pitch was in excellent condition. Will definitely
                  book again!
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Sara K.</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2">
                  The tennis courts are well-maintained. The only downside was the limited parking space. Otherwise, a
                  great experience.
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            <div className="relative h-40 w-full rounded-lg overflow-hidden border">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Map is loading...</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <Button size="sm">Get Directions</Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">123 Sports Street, Nasr City, Cairo, Egypt</p>
          </div>

          {/* Book Now Button */}
          <div className="pt-4">
            <Button className="w-full" size="lg">
              Book Now
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
