"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Plus,
  Share,
  Users,
  Minus,
  ClubIcon as Football,
  Shirt,
  Wallet,
  Banknote,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedTime, setSelectedTime] = useState("5:00 PM")
  const [playerCount, setPlayerCount] = useState(10)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/bookings")
    }
  }

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Book Facility</h1>
        <Button variant="ghost" size="icon">
          <Share className="h-5 w-5" />
        </Button>
      </header>

      <main className="container p-4 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div className={`h-1 w-8 ${step > 1 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div className={`h-1 w-8 ${step > 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Step {step} of 3</div>
        </div>

        {/* Venue Info */}
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
                    Available
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Football Pitch #3</p>
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Nasr City, Cairo</span>
                </div>
                <div className="font-semibold mt-1">
                  EGP 250 <span className="text-xs text-muted-foreground">/ hour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Select Date & Time */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Date & Time</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Date</h3>
                <div className="flex overflow-x-auto pb-2 gap-2">
                  {["Today", "Tomorrow", "Wed, 25 Apr", "Thu, 26 Apr", "Fri, 27 Apr"].map((day, index) => (
                    <Button key={index} variant={index === 0 ? "default" : "outline"} className="whitespace-nowrap">
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map((time) => (
                    <Button
                      key={time}
                      variant={time === selectedTime ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Duration</h3>
                <Tabs defaultValue="1">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="1">1 hour</TabsTrigger>
                    <TabsTrigger value="2">2 hours</TabsTrigger>
                    <TabsTrigger value="3">3 hours</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="pt-4">
                <Button className="w-full" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Player Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Player Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Number of Players</h3>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold">{playerCount}</span>
                  <Button variant="outline" size="icon" onClick={() => setPlayerCount(Math.min(14, playerCount + 1))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1">Maximum capacity: 14 players</div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Invite Team Members</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Players
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Players</DialogTitle>
                      <DialogDescription>
                        Select team members or invite new players to join this booking.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="search-players">Search Players</Label>
                        <Input id="search-players" placeholder="Search by name or email" />
                      </div>

                      <div className="space-y-2">
                        <Label>Team Members</Label>
                        <div className="space-y-2">
                          {["Ahmed K.", "Mohamed S.", "Omar T.", "Khaled M."].map((player, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`player-${index}`} />
                              <Label htmlFor={`player-${index}`} className="font-normal">
                                {player}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-player">Invite New Player</Label>
                        <div className="flex gap-2">
                          <Input id="new-player" placeholder="Email or phone number" />
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Invite Selected</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Equipment Rental</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <Football className="h-4 w-4 mr-2" />
                      <span>Football</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">EGP 50</span>
                      <Checkbox id="football" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <Shirt className="h-4 w-4 mr-2" />
                      <span>Bibs (10 pcs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">EGP 30</span>
                      <Checkbox id="bibs" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full" onClick={handleNext}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Payment</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-3 border rounded-md">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      className="h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
                      defaultChecked
                    />
                    <label htmlFor="card" className="flex items-center ml-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Credit/Debit Card</div>
                        <div className="text-xs text-muted-foreground">Visa ending in 4242</div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center p-3 border rounded-md">
                    <input
                      type="radio"
                      id="wallet"
                      name="payment"
                      className="h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
                    />
                    <label htmlFor="wallet" className="flex items-center ml-2">
                      <Wallet className="h-4 w-4 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Mobile Wallet</div>
                        <div className="text-xs text-muted-foreground">Pay with your mobile wallet</div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center p-3 border rounded-md">
                    <input
                      type="radio"
                      id="cash"
                      name="payment"
                      className="h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
                    />
                    <label htmlFor="cash" className="flex items-center ml-2">
                      <Banknote className="h-4 w-4 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Cash on Arrival</div>
                        <div className="text-xs text-muted-foreground">Pay at the venue</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Booking Summary</h3>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          Today, {selectedTime} - {selectedTime.replace("5:00", "6:00")}
                        </span>
                      </div>
                      <span className="font-medium">EGP 250</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{playerCount} Players</span>
                      </div>
                      <span className="font-medium">EGP 0</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Equipment Rental</span>
                      <span className="font-medium">EGP 0</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Service Fee</span>
                      <span className="font-medium">EGP 25</span>
                    </div>

                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total</span>
                        <span>EGP 275</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary underline">
                      Terms & Conditions
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="save-payment" />
                  <Label htmlFor="save-payment" className="text-sm font-normal">
                    Save payment method for future bookings
                  </Label>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full" onClick={handleNext}>
                  Confirm & Pay
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
