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
import {
  Filter,
  List,
  MapIcon,
  MapPin,
  SearchIcon,
  SlidersHorizontal,
  Star,
  X,
  Calendar,
  Clock,
  Dumbbell,
  Waves,
  ClubIcon as Football,
  TurtleIcon as Tennis,
  ShoppingBasketIcon as Basketball,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getVenues, type Sport, type Venue } from "@/lib/mock-data"
import { MapView } from "@/components/map-view"
import { venueToMapMarkers } from "@/lib/map-service"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
// Import the VenueCard component at the top of the file
import { VenueCard } from "@/components/venue-card"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState<Sport | "all">((searchParams.get("sport") as Sport) || "all")
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500])
  const [distance, setDistance] = useState<number>(10)
  const [selectedDate, setSelectedDate] = useState("Today")
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [amenities, setAmenities] = useState<{ [key: string]: boolean }>({
    parking: false,
    showers: false,
    equipment: false,
    cafe: false,
  })
  const [availableNow, setAvailableNow] = useState<boolean>(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)

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

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
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
    setSelectedDate("Today")
    setSelectedTime(null)
    toast({
      title: "Filters reset",
      description: "All search filters have been reset to default values.",
    })
  }

  const handleMarkerClick = (markerId: string) => {
    setSelectedVenueId(markerId)
    if (view === "map") {
      const venue = venues.find((v) => v.id === markerId)
      if (venue) {
        toast({
          title: venue.name,
          description: `${venue.location} • ${venue.sports.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}`,
          action: (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/venue/${venue.id}`}>View Details</Link>
            </Button>
          ),
        })
      }
    }
  }

  const getSportIcon = (sport: Sport) => {
    switch (sport) {
      case "football":
        return <Football className="h-4 w-4 mr-2" />
      case "tennis":
        return <Tennis className="h-4 w-4 mr-2" />
      case "basketball":
        return <Basketball className="h-4 w-4 mr-2" />
      case "gym":
        return <Dumbbell className="h-4 w-4 mr-2" />
      case "swimming":
        return <Waves className="h-4 w-4 mr-2" />
      default:
        return null
    }
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
              <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
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
                  <h3 className="text-sm font-medium">Date</h3>
                  <div className="flex overflow-x-auto pb-2 gap-2">
                    {["Today", "Tomorrow", "Wed, 25 Apr", "Thu, 26 Apr", "Fri, 27 Apr"].map((day) => (
                      <Button
                        key={day}
                        variant={day === selectedDate ? "default" : "outline"}
                        className="whitespace-nowrap"
                        onClick={() => setSelectedDate(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Time</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["9:00 AM", "12:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM"].map((time) => (
                      <Button
                        key={time}
                        variant={time === selectedTime ? "default" : "outline"}
                        onClick={() => setSelectedTime(time === selectedTime ? null : time)}
                      >
                        {time}
                      </Button>
                    ))}
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button
              variant={Object.values(amenities).some((v) => v) || availableNow || selectedTime ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => {
                const sheet = document.querySelector("[data-sheet-trigger]")
                if (sheet) (sheet as HTMLButtonElement).click()
              }}
            >
              <Filter className="h-3 w-3 mr-1" />
              Filters{" "}
              {Object.values(amenities).filter((v) => v).length + (availableNow ? 1 : 0) + (selectedTime ? 1 : 0) > 0 &&
                `(${Object.values(amenities).filter((v) => v).length + (availableNow ? 1 : 0) + (selectedTime ? 1 : 0)})`}
            </Button>
            <Button
              variant={selectedDate !== "Today" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => {
                const sheet = document.querySelector("[data-sheet-trigger]")
                if (sheet) (sheet as HTMLButtonElement).click()
              }}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {selectedDate}
            </Button>
            {selectedTime && (
              <Button
                variant="default"
                size="sm"
                className="h-8"
                onClick={() => {
                  const sheet = document.querySelector("[data-sheet-trigger]")
                  if (sheet) (sheet as HTMLButtonElement).click()
                }}
              >
                <Clock className="h-3 w-3 mr-1" />
                {selectedTime}
              </Button>
            )}
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
          <TabsList className="mb-4 w-full overflow-x-auto">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="football" className="flex-1">
              <Football className="h-4 w-4 mr-1 inline-block" />
              Football
            </TabsTrigger>
            <TabsTrigger value="tennis" className="flex-1">
              <Tennis className="h-4 w-4 mr-1 inline-block" />
              Tennis
            </TabsTrigger>
            <TabsTrigger value="basketball" className="flex-1">
              <Basketball className="h-4 w-4 mr-1 inline-block" />
              Basketball
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <Skeleton className="h-40 w-full rounded-t-lg" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : view === "list" ? (
              // Then replace the venue card rendering in the list view with:
              <>
                {venues.length > 0 ? (
                  venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 border rounded-lg">
                    <p className="text-muted-foreground mb-2">No venues found matching your criteria</p>
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <MapView
                markers={venueToMapMarkers(venues)}
                onMarkerClick={handleMarkerClick}
                height="calc(100vh - 220px)"
              />
            )}
          </TabsContent>

          {["football", "tennis", "basketball"].map((sport) => (
            <TabsContent key={sport} value={sport}>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="h-40 w-full rounded-t-lg" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : view === "list" ? (
                <div className="space-y-4">
                  {venues
                    .filter((venue) => venue.sports.includes(sport as Sport))
                    .map((venue) => (
                      <Card key={venue.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-0">
                          <div className="relative h-40 w-full">
                            <Image
                              src={venue.images[0] || "/placeholder.svg"}
                              alt={venue.name}
                              fill
                              className="object-cover rounded-t-lg"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="bg-white/90">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                {venue.rating}
                              </Badge>
                            </div>
                            {availableNow && (
                              <Badge className="absolute top-2 left-2 bg-green-500">Available Now</Badge>
                            )}
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
                                {venue.sports.slice(0, 3).map((s) => (
                                  <Badge key={s} variant="outline" className="text-xs flex items-center">
                                    {getSportIcon(s as Sport)}
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
              ) : (
                <MapView
                  markers={venueToMapMarkers(venues.filter((venue) => venue.sports.includes(sport as Sport)))}
                  onMarkerClick={handleMarkerClick}
                  height="calc(100vh - 220px)"
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
