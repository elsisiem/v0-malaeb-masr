"use client"

import { useState } from "react"
import Image from "next/image"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronRight, MessageSquare, Plus, Search, Users } from "lucide-react"
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

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("myTeams")

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Teams</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new team</DialogTitle>
                <DialogDescription>Create a team to organize games and split payments with friends.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input id="team-name" placeholder="Enter team name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-sport">Sport</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select a sport</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="tennis">Tennis</option>
                    <option value="volleyball">Volleyball</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description (Optional)</Label>
                  <textarea
                    id="team-description"
                    placeholder="Tell us about your team"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search teams..." className="pl-9" />
        </div>

        <Tabs defaultValue="myTeams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="myTeams">My Teams</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="myTeams" className="space-y-4">
            {/* Team Card 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=FC"
                      alt="Team logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Cairo Eagles FC</h3>
                      <Badge variant="outline" className="text-green-600 bg-green-50">
                        Captain
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Football Team</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="mr-3">8 members</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Next game: Today, 5:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +4
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Card 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=BC"
                      alt="Team logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Cairo Ballers</h3>
                      <Badge variant="outline" className="text-blue-600 bg-blue-50">
                        Member
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Basketball Team</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="mr-3">12 members</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Next game: Tomorrow, 7:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +8
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Popular Teams</h2>
              <Button variant="ghost" size="sm" className="text-primary flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Discover Team Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=NT"
                      alt="Team logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Nasr City Tigers</h3>
                    <p className="text-sm text-muted-foreground">Football Team</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="mr-3">15 members</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Active since Jan 2025</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +12
                        </div>
                      </div>
                      <Button size="sm">Join Team</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=MA"
                      alt="Team logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Maadi Aces</h3>
                    <p className="text-sm text-muted-foreground">Tennis Team</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="mr-3">8 members</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Active since Mar 2025</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +5
                        </div>
                      </div>
                      <Button size="sm">Join Team</Button>
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
