"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import {
  Bell,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  Moon,
  Settings,
  Share,
  Shield,
  Star,
  User,
  ChevronRight,
  Globe,
  MessageSquare,
  Info,
} from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      <main className="container p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
            <Image src="/images/profile-pic1.png" alt="Profile picture" fill className="object-cover" sizes="80px" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Ahmed Mohamed</h2>
            <p className="text-sm text-muted-foreground">ahmed@example.com</p>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                Football
              </Badge>
              <Badge variant="outline">Tennis</Badge>
            </div>
          </div>
          <Button variant="outline" size="icon" className="ml-auto bg-transparent">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {/* Stats Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Activity Stats</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 border rounded-md">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Bookings</div>
                  </div>
                  <div className="p-2 border rounded-md">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">Teams</div>
                  </div>
                  <div className="p-2 border rounded-md">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Venues</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">You rated Cairo Sports Club</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">You joined Cairo Ballers team</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">You favorited Elite Sports Center</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Payment Methods</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add New
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 04/28</p>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Favorite Venue Card */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/images/football-field.png"
                      alt="Football pitch"
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Elite Sports Center</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.8</span>
                          <span className="mx-1">•</span>
                          <span>Nasr City, 2.3 km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">EGP 250</div>
                        <div className="text-xs text-muted-foreground">per hour</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Venue Card */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/images/tennis-court.png"
                      alt="Tennis court"
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Cairo Tennis Academy</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.6</span>
                          <span className="mx-1">•</span>
                          <span>Maadi, 4.1 km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">EGP 180</div>
                        <div className="text-xs text-muted-foreground">per hour</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Account Settings */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Account Settings</h3>
                <div className="space-y-4">
                  <Link
                    href="/profile/edit"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-3" />
                      <span>Edit Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/profile/payment"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-3" />
                      <span>Payment Methods</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/profile/security"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-3" />
                      <span>Security</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-3" />
                      <span>Notifications</span>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-3" />
                      <span>Dark Mode</span>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={mounted ? theme === "dark" : false}
                      onCheckedChange={(checked) => {
                        console.log("[v0] Theme toggle clicked:", checked ? "dark" : "light")
                        setTheme(checked ? "dark" : "light")
                      }}
                      disabled={!mounted}
                    />
                  </div>

                  <Link
                    href="/profile/language"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-3" />
                      <span>Language</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">English</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Support</h3>
                <div className="space-y-4">
                  <Link href="/help" className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-3" />
                      <span>Help Center</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link href="/contact" className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-3" />
                      <span>Contact Support</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link href="/about" className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-3" />
                      <span>About</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link href="/share" className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center">
                      <Share className="h-4 w-4 mr-3" />
                      <span>Share App</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
