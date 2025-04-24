"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
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
import { getVenues, type Sport, type Venue } from "@/lib/mock-data"
import Link from "next/link"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState<Sport | "all">((searchParams.get("sport") as Sport) || "all")
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500])
  const [distance, setDistance] = useState<number>(10)
  const [amenities, setAmenities] = useState<{ [key: string]: boolean }>({
    parking: false,
    showers: false,
    equipment: false,
    cafe: false,
  })
  const [availableNow, setAvailableNow] = useState<boolean>(false)
  const [venues, setVenues] = useState<Venue[]>([])

  useEffect(() => {
    // Apply filters
    const sportFilter = selectedSport === "all" ? undefined : selectedSport
    const amenitiesFilter = Object.entries(amenities)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        switch (key) {
          case "parking":
            return "Parking"
          case "showers":
            return "Showers"
          case "equipment":
            return "Equipment Rental"
          case "cafe":
            return "Café"
          default:
            return ""
        }
      })
      .filter(Boolean)

    const filteredVenues = getVenues({
      sport: sportFilter as Sport | undefined,
      priceRange,
      distance,
      amenities: amenitiesFilter.length > 0 ? amenitiesFilter : undefined,
    })

    // Apply search query if any
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      setVenues(
        filteredVenues.filter(
          (venue) =>
            venue.name.toLowerCase().includes(query) ||
            venue.location.toLowerCase().includes(query) ||
            venue.sports.some((sport) => sport.toLowerCase().includes(query)),
        ),
      )
    } else {
      setVenues(filteredVenues)
    }
  }, [selectedSport, priceRange, distance, amenities, availableNow, searchQuery])

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport as Sport | "all")
  }

  const handleResetFilters = () => {
    setPriceRange([50, 500])
    setDistance(10)
    setAmenities({
      parking: false,
      showers: false,
      equipment: false,
      cafe: false,
    })
    setAvailableNow(false)
  }

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
                    {["football", "tennis", "basketball", "volleyball", "squash", "padel", "swimming", "gym"].map(
                      (sport) => (
                        <Badge
                          key={sport}
                          variant={selectedSport === sport ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleSportChange(sport)}
                        >
                          {sport.charAt(0).toUpperCase() + sport.slice(1)}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price Range (EGP)</h3>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>EGP {priceRange[0]}</span>
                    <span>EGP {priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Distance</h3>
                  <Slider
                    defaultValue={[distance]}
                    min={1}
                    max={20}
                    step={1}
                    value={[distance]}
                    onValueChange={(value) => setDistance(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>{distance} km</span>
                    <span>20 km</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Amenities</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="parking"
                        checked={amenities.parking}
                        onCheckedChange={(checked) => setAmenities({ ...amenities, parking: checked })}
                      />
                      <Label htmlFor="parking">Parking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showers"
                        checked={amenities.showers}
                        onCheckedChange={(checked) => setAmenities({ ...amenities, showers: checked })}
                      />
                      <Label htmlFor="showers">Showers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="equipment"
                        checked={amenities.equipment}
                        onCheckedChange={(checked) => setAmenities({ ...amenities, equipment: checked })}
                      />
                      <Label htmlFor="equipment">Equipment Rental</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cafe"
                        checked={amenities.cafe}
                        onCheckedChange={(checked) => setAmenities({ ...amenities, cafe: checked })}
                      />
                      <Label htmlFor="cafe">Café</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available-now"
                      checked={availableNow}
                      onCheckedChange={(checked) => setAvailableNow(checked)}
                    />
                    <Label htmlFor="available-now">Available Now</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={() => router.push("/search")}>
                    Apply Filters
                  </Button>
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
        <Tabs defaultValue={selectedSport === "all" ? "all" : selectedSport} onValueChange={handleSportChange}>
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
                {venues.length > 0 ? (
                  venues.map((venue) => (
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
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 border rounded-lg">
                    <p className="text-muted-foreground mb-2">No venues found matching your criteria</p>
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-[calc(100vh-220px)] w-full rounded-lg overflow-hidden border">
                <Image src="/images/map-placeholder.png" alt="Map view" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground bg-background/80 p-2 rounded">Map view is loading...</p>
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

          {["football", "tennis", "basketball"].map((sport) => (
            <TabsContent key={sport} value={sport}>
              <div className="space-y-4">
                {venues
                  .filter((venue) => venue.sports.includes(sport as Sport))
                  .map((venue) => (
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
                              {venue.sports.slice(0, 2).map((s) => (
                                <Badge key={s} variant="outline" className="text-xs">
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
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
          ))}
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
