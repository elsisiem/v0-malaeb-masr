"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MapPin, Star, Users, BarChart, ArrowUp, ArrowDown, Plus } from "lucide-react"
import { getBookings, getVenues, type Venue } from "@/lib/mock-data"

export default function OwnerPortalPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const venues = getVenues()
  const bookings = getBookings()

  // Calculate mock statistics
  const totalBookings = bookings.length
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0)
  const averageRating = venues.reduce((sum, venue) => sum + venue.rating, 0) / venues.length
  const occupancyRate = 78 // Mock percentage

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Facility Owner Portal</h1>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Venue
          </Button>
        </div>
      </header>

      <main className="container p-4">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">EGP {totalRevenue}</div>
                  <div className="text-xs text-muted-foreground">Total Revenue</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">{totalBookings}</div>
                  <div className="text-xs text-muted-foreground">Total Bookings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Star className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">{occupancyRate}%</div>
                  <div className="text-xs text-muted-foreground">Occupancy Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.facilityName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{booking.facilityName}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.date}, {booking.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">EGP {booking.price}</div>
                      <Badge
                        variant="outline"
                        className={
                          booking.status === "upcoming"
                            ? "text-green-600 bg-green-50"
                            : booking.status === "past"
                              ? "text-gray-600 bg-gray-100"
                              : "text-red-600 bg-red-50"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#" onClick={() => setActiveTab("bookings")}>
                    View All Bookings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-60 flex items-center justify-center">
                  <BarChart className="h-40 w-40 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">This Week</div>
                      <div className="text-lg font-bold">EGP 4,250</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Last Week</div>
                      <div className="text-lg font-bold">EGP 3,850</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Bookings</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>

            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
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
                            booking.status === "upcoming"
                              ? "text-green-600 bg-green-50"
                              : booking.status === "past"
                                ? "text-gray-600 bg-gray-100"
                                : "text-red-600 bg-red-50"
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                        <div className="font-semibold">EGP {booking.price}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Contact User
                          </Button>
                          <Button size="sm">Manage</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="venues" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My Venues</h2>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add New Venue
              </Button>
            </div>

            {venues.map((venue: Venue) => (
              <Card key={venue.id}>
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
                          {venue.location}
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-60 flex items-center justify-center">
                  <BarChart className="h-40 w-40 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                      <div className="text-2xl font-bold">EGP {totalRevenue}</div>
                      <div className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        10.5% from last month
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Average Booking Value</div>
                      <div className="text-2xl font-bold">EGP {(totalRevenue / totalBookings).toFixed(0)}</div>
                      <div className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        5.2% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Analytics</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-60 flex items-center justify-center">
                  <BarChart className="h-40 w-40 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Total Bookings</div>
                      <div className="text-2xl font-bold">{totalBookings}</div>
                      <div className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        8.3% from last month
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                      <div className="text-2xl font-bold">{occupancyRate}%</div>
                      <div className="text-xs text-red-600 flex items-center mt-1">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        2.1% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Time Slots</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">5:00 PM - 6:00 PM</div>
                    <div className="w-2/3 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <div className="text-sm font-medium">85%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">6:00 PM - 7:00 PM</div>
                    <div className="w-2/3 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                    <div className="text-sm font-medium">92%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">7:00 PM - 8:00 PM</div>
                    <div className="w-2/3 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <div className="text-sm font-medium">78%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">8:00 PM - 9:00 PM</div>
                    <div className="w-2/3 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="text-sm font-medium">65%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">9:00 AM - 10:00 AM</div>
                    <div className="w-2/3 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="text-sm font-medium">45%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
