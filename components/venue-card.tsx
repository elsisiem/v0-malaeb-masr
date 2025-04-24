import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import { ImageWithFallback } from "@/components/image-with-fallback"
import type { Venue } from "@/lib/mock-data"

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-0">
        <div className="relative h-40 w-full">
          <ImageWithFallback
            src={venue.images[0] || "/placeholder.svg?height=400&width=400"}
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
  )
}
