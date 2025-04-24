"use client"

import { useState } from "react"
import Image from "next/image"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Filter, List, MapIcon, MapPin, SearchIcon, SlidersHorizontal, Star, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const [view, setView] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues, sports, locations..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your search results</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sport Type</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer">
                      Football
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Tennis
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Basketball
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Volleyball
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Squash
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Padel
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price Range (EGP)</h3>
                  <Slider defaultValue={[50, 300]} min={0} max={500} step={10} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>EGP 50</span>
                    <span>EGP 300</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Distance</h3>
                  <Slider defaultValue={[5]} min={1} max={20} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>5 km</span>
                    <span>20 km</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Amenities</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="parking" />
                      <Label htmlFor="parking">Parking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="showers" />
                      <Label htmlFor="showers">Showers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="equipment" />
                      <Label htmlFor="equipment">Equipment Rental</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="cafe" />
                      <Label htmlFor="cafe">Café</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="available-now" />
                    <Label htmlFor="available-now">Available Now</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    Reset
                  </Button>
                  <Button className="flex-1">Apply Filters</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              Today
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              5-7 PM
            </Button>
          </div>
          <div className="flex items-center border rounded-md">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 rounded-r-none"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "map" ? "default" : "ghost"}
              size="sm"
              className="h-8 rounded-l-none"
              onClick={() => setView("map")}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container p-4">
        <Tabs defaultValue="all">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="football" className="flex-1">
              Football
            </TabsTrigger>
            <TabsTrigger value="tennis" className="flex-1">
              Tennis
            </TabsTrigger>
            <TabsTrigger value="basketball" className="flex-1">
              Basketball
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {view === "list" ? (
              <div className="space-y-4">
                {/* Venue Cards */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <div className="relative h-40 w-full">
                        <Image
                          src={`/placeholder.svg?height=160&width=400&text=Venue ${index + 1}`}
                          alt={`Venue ${index + 1}`}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {(4 + Math.random()).toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">Sports Venue {index + 1}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {["Nasr City", "Maadi", "Heliopolis", "Zamalek", "New Cairo"][index]},{" "}
                              {(1 + index * 0.7).toFixed(1)} km
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">EGP {150 + index * 30}</div>
                            <div className="text-xs text-muted-foreground">per hour</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {["Football", "Tennis", "Basketball", "Volleyball", "Padel"][index % 5]}
                            </Badge>
                            {index % 2 === 0 && (
                              <Badge variant="outline" className="text-xs">
                                {["Squash", "Swimming", "Gym"][index % 3]}
                              </Badge>
                            )}
                          </div>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="relative h-[calc(100vh-220px)] w-full rounded-lg overflow-hidden border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Map view is loading...</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Button size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="football">
            <div className="flex items-center justify-center h-40 border rounded-lg">
              <p className="text-muted-foreground">Loading football venues...</p>
            </div>
          </TabsContent>

          <TabsContent value="tennis">
            <div className="flex items-center justify-center h-40 border rounded-lg">
              <p className="text-muted-foreground">Loading tennis venues...</p>
            </div>
          </TabsContent>

          <TabsContent value="basketball">
            <div className="flex items-center justify-center h-40 border rounded-lg">
              <p className="text-muted-foreground">Loading basketball venues...</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
