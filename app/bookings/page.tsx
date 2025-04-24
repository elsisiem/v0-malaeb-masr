"use client"

import { useState } from "react"
import Image from "next/image"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, QrCode } from "lucide-react"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <h1 className="text-xl font-bold">My Bookings</h1>
      </header>

      <main className="container p-4">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Booking Card 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Football pitch"
                      fill
                      className="object-cover"
                    />
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
                    <div className="flex items-center mt-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Nasr City, Cairo</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-semibold">EGP 250</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <QrCode className="h-3 w-3 mr-1" />
                          Ticket
                        </Button>
                        <Button size="sm">Directions</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image src="/placeholder.svg?height=80&width=80" alt="Tennis court" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Cairo Tennis Academy</h3>
                      <Badge variant="outline" className="text-blue-600 bg-blue-50">
                        Tomorrow
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Tennis Court #2</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">April 24, 2025</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>10:00 AM - 11:00 AM</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Maadi, Cairo</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-semibold">EGP 180</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <QrCode className="h-3 w-3 mr-1" />
                          Ticket
                        </Button>
                        <Button size="sm">Directions</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card 3 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Basketball court"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Elite Sports Center</h3>
                      <Badge variant="outline" className="text-purple-600 bg-purple-50">
                        Next Week
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Basketball Court</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">April 30, 2025</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>7:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>New Cairo, Cairo</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-semibold">EGP 200</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {/* Past Booking Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Football pitch"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Cairo Sports Club</h3>
                      <Badge variant="outline" className="text-gray-600 bg-gray-100">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Football Pitch #1</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">April 16, 2025</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>6:00 PM - 7:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-semibold">EGP 250</div>
                      <Button variant="outline" size="sm">
                        Leave Review
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image src="/placeholder.svg?height=80&width=80" alt="Tennis court" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Cairo Tennis Academy</h3>
                      <Badge variant="outline" className="text-gray-600 bg-gray-100">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Tennis Court #3</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">April 10, 2025</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>9:00 AM - 10:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-semibold">EGP 180</div>
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Basketball court"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Elite Sports Center</h3>
                      <Badge variant="outline" className="text-red-600 bg-red-50">
                        Canceled
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Basketball Court</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">April 5, 2025</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>7:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-semibold">EGP 200</div>
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    </div>
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
