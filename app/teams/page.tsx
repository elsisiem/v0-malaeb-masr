"use client"

import { useState, useEffect } from "react"
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
import { getTeams } from "@/lib/mock-data"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("myTeams")
  const [teams, setTeams] = useState<ReturnType<typeof getTeams>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [teamName, setTeamName] = useState("")
  const [teamSport, setTeamSport] = useState("")
  const [teamDescription, setTeamDescription] = useState("")

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setTeams(getTeams())
      setIsLoading(false)
    }, 500)
  }, [])

  const handleCreateTeam = () => {
    if (!teamName || !teamSport) {
      toast({
        title: "Missing information",
        description: "Please provide a team name and select a sport.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Team created!",
      description: `Your team "${teamName}" has been created successfully.`,
    })

    // Reset form
    setTeamName("")
    setTeamSport("")
    setTeamDescription("")
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.sport.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                  <Input
                    id="team-name"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-sport">Sport</Label>
                  <Select value={teamSport} onValueChange={setTeamSport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="padel">Padel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description (Optional)</Label>
                  <textarea
                    id="team-description"
                    placeholder="Tell us about your team"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateTeam}>
                  Create Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="myTeams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="myTeams">My Teams</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="myTeams" className="space-y-4">
            {isLoading ? (
              Array(2)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-3" />
                          <Skeleton className="h-4 w-2/3 mb-3" />
                          <div className="flex justify-between">
                            <Skeleton className="h-8 w-20" />
                            <div className="flex gap-2">
                              <Skeleton className="h-9 w-20" />
                              <Skeleton className="h-9 w-20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <Card key={team.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                        <Image
                          src={team.image || "/placeholder.svg"}
                          alt={team.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{team.name}</h3>
                          <Badge
                            variant="outline"
                            className={team.isOwner ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}
                          >
                            {team.isOwner ? "Captain" : "Member"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {team.sport.charAt(0).toUpperCase() + team.sport.slice(1)} Team
                        </p>
                        <div className="flex items-center mt-2 text-sm">
                          <Users className="h-3 w-3 mr-1" />
                          <span className="mr-3">{team.memberCount} members</span>
                          {team.nextGame && (
                            <>
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                Next game: {team.nextGame.date}, {team.nextGame.time}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 4).map((member) => (
                              <div
                                key={member.id}
                                className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs overflow-hidden"
                              >
                                {member.image ? (
                                  <Image
                                    src={member.image || "/placeholder.svg"}
                                    alt={member.name}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                ) : (
                                  member.initial
                                )}
                              </div>
                            ))}
                            {team.members.length > 4 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                +{team.members.length - 4}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/teams/${team.id}?tab=chat`}>
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Chat
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/teams/${team.id}`}>{team.isOwner ? "Manage" : "View"}</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border rounded-lg">
                <p className="text-muted-foreground mb-4">No teams found matching your search</p>
                {searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Create Your First Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a new team</DialogTitle>
                        <DialogDescription>
                          Create a team to organize games and split payments with friends.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="team-name">Team Name</Label>
                          <Input
                            id="team-name"
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="team-sport">Sport</Label>
                          <Select value={teamSport} onValueChange={setTeamSport}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sport" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="football">Football</SelectItem>
                              <SelectItem value="basketball">Basketball</SelectItem>
                              <SelectItem value="tennis">Tennis</SelectItem>
                              <SelectItem value="volleyball">Volleyball</SelectItem>
                              <SelectItem value="padel">Padel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="team-description">Description (Optional)</Label>
                          <textarea
                            id="team-description"
                            placeholder="Tell us about your team"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleCreateTeam}>
                          Create Team
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
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
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                    <Image
                      src="/images/football-field2.png"
                      alt="Team logo"
                      fill
                      className="object-cover"
                      sizes="64px"
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
                          <div key={i} className="h-6 w-6 rounded-full overflow-hidden border-2 border-background">
                            <Image
                              src={`/images/profile-pic${(i % 3) + 1}.png`}
                              alt="Member"
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +12
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Request sent!",
                            description: "Your request to join Nasr City Tigers has been sent.",
                          })
                        }}
                      >
                        Join Team
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border">
                    <Image src="/images/tennis-court.png" alt="Team logo" fill className="object-cover" sizes="64px" />
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
                          <div key={i} className="h-6 w-6 rounded-full overflow-hidden border-2 border-background">
                            <Image
                              src={`/images/profile-pic${(i % 3) + 1}.png`}
                              alt="Member"
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +5
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Request sent!",
                            description: "Your request to join Maadi Aces has been sent.",
                          })
                        }}
                      >
                        Join Team
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
