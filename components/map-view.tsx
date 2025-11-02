"use client"

import { useEffect, useRef, useState } from "react"
import { type MapMarker, getUserLocation, getDirectionsUrl } from "@/lib/map-service"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"
import type { Venue } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface MapViewProps {
  markers: MapMarker[]
  onMarkerClick?: (markerId: string) => void
  height?: string
  className?: string
}

export function MapView({ markers, onMarkerClick, height = "400px", className = "" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Simulate map initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Get user location
    getUserLocation().then((location) => {
      setUserLocation(location)
    })

    return () => clearTimeout(timer)
  }, [])

  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker)
    if (onMarkerClick) {
      onMarkerClick(marker.id)
    }
  }

  // Get directions to selected marker
  const getDirections = () => {
    if (selectedMarker) {
      const url = getDirectionsUrl(selectedMarker.latitude, selectedMarker.longitude)
      window.open(url, "_blank")
    }
  }

  return (
    <div ref={mapRef} className={`relative rounded-lg overflow-hidden border ${className}`} style={{ height }}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          <Image src="/images/map-placeholder.png" alt="Map view" fill className="object-cover" />

          {/* Simulated markers */}
          {markers.map((marker, index) => (
            <div
              key={marker.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                top: `${30 + (marker.latitude - 30) * 1000}%`,
                left: `${50 + (marker.longitude - 31.2) * 100}%`,
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              <div className={`p-1 rounded-full ${selectedMarker?.id === marker.id ? "bg-primary" : "bg-primary/70"}`}>
                <MapPin
                  className={`h-6 w-6 ${selectedMarker?.id === marker.id ? "text-primary-foreground" : "text-primary-foreground/90"}`}
                />
              </div>
            </div>
          ))}

          {/* User location marker */}
          {userLocation && (
            <div
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                top: `${30 + (userLocation.lat - 30) * 1000}%`,
                left: `${50 + (userLocation.lng - 31.2) * 100}%`,
              }}
            >
              <div className="p-1 rounded-full bg-blue-500">
                <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-background"></div>
              </div>
            </div>
          )}

          {/* Selected marker info */}
          {selectedMarker && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedMarker.title}</h3>
                      <p className="text-xs text-muted-foreground">{selectedMarker.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={getDirections}>
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/venue/${selectedMarker.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              size="sm"
              onClick={() => setUserLocation((prevState) => (prevState ? null : { lat: 30.0444, lng: 31.2357 }))}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {userLocation ? "Hide" : "Show"} My Location
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
