"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function CreateProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedSports, setSelectedSports] = useState<string[]>([])

  const handleAddSport = (sport: string) => {
    if (!selectedSports.includes(sport)) {
      setSelectedSports([...selectedSports, sport])
    }
  }

  const handleRemoveSport = (sport: string) => {
    setSelectedSports(selectedSports.filter((s) => s !== sport))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete your profile</CardTitle>
          <CardDescription>
            Step {step} of 3:{" "}
            {step === 1 ? "Personal Information" : step === 2 ? "Sports Interests" : "Payment Preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">City</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cairo">Cairo</SelectItem>
                    <SelectItem value="alexandria">Alexandria</SelectItem>
                    <SelectItem value="giza">Giza</SelectItem>
                    <SelectItem value="sharm">Sharm El-Sheikh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select your favorite sports</Label>
                <Select onValueChange={handleAddSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="volleyball">Volleyball</SelectItem>
                    <SelectItem value="squash">Squash</SelectItem>
                    <SelectItem value="padel">Padel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSports.map((sport) => (
                  <Badge key={sport} variant="secondary" className="flex items-center gap-1">
                    {sport}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSport(sport)} />
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                <Label>Playing frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do you play?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skill level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred payment method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="wallet">Mobile Wallet</SelectItem>
                    <SelectItem value="cash">Cash on Arrival</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="save-payment" />
                  <Label htmlFor="save-payment">Save payment details for future bookings</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" defaultChecked />
                  <Label htmlFor="notifications">Receive booking confirmations and reminders</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="promotions" />
                  <Label htmlFor="promotions">Receive promotions and offers</Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={handleNext}>{step < 3 ? "Next" : "Complete"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
