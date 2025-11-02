"use client"

import { useTranslations } from "next-intl"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, TrendingUp, Calendar, Star, DollarSign } from "lucide-react"

export default function OwnerPage() {
  const t = useTranslations("owner")
  const common = useTranslations("common")

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t("addVenue")}
          </Button>
        </div>
      </header>

      <main className="container p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalRevenue")}</p>
                  <p className="text-2xl font-bold">{common("egp")} 45,230</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalBookings")}</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("averageRating")}</p>
                  <p className="text-2xl font-bold">4.7</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("occupancyRate")}</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t("recentBookings")}</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                {t("viewAllBookings")}
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">Ahmed Mohamed</p>
                  <p className="text-sm text-muted-foreground">Football Pitch A • Today 6:00 PM</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{common("egp")} 250</p>
                </div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">Sara Ali</p>
                  <p className="text-sm text-muted-foreground">Tennis Court 1 • Tomorrow 4:00 PM</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{common("egp")} 180</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  )
}
