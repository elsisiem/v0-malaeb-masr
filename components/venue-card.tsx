import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import { ImageWithFallback } from "@/components/image-with-fallback"
import type { Venue } from "@/lib/mock-data"
import { SportBadge } from "@/components/sport-icon"

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-0">
        <div className="relative h-44 w-full">
          <ImageWithFallback
            src={venue.images?.[0] || "/placeholder.svg?height=400&width=400"}
            alt={venue.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Rating badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 text-xs font-semibold text-foreground shadow-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {venue.rating ?? "New"}
            </span>
          </div>
          {/* Venue name + location on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-base leading-tight drop-shadow">{venue.name}</h3>
            <div className="flex items-center text-white/85 text-xs mt-0.5">
              <MapPin className="h-3 w-3 mr-0.5 shrink-0" />
              {venue.district}
              {venue.distance ? ` · ${venue.distance} km` : ""}
            </div>
          </div>
        </div>

        <div className="px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {(venue.sports ?? []).slice(0, 2).map((sport) => (
              <SportBadge key={sport} sport={sport} />
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right leading-tight">
              <div className="text-sm font-bold">EGP {venue.price}</div>
              <div className="text-[10px] text-muted-foreground">/ hr</div>
            </div>
            <Button size="sm" asChild className="h-8 px-3">
              <Link href={`/venue/${venue.id}`}>Book</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
