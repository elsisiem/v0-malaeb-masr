"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Calendar, MessageSquare } from "lucide-react"

export default function TeamsPage() {
  const t = useTranslations("teams")
  const common = useTranslations("common")
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState("myTeams")

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t("createTeam")}
          </Button>
        </div>
      </header>

      <main className="container p-4">
        <Tabs defaultValue="myTeams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="myTeams">{t("myTeams")}</TabsTrigger>
            <TabsTrigger value="discover">{t("discover")}</TabsTrigger>
          </TabsList>

          <TabsContent value="myTeams" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Cairo Ballers</h3>
                      <Badge>{t("captain")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">12 {t("members")}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Calendar className="h-3 w-3 mr-1" />
                        {t("schedule")}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {t("chat")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Weekend Warriors</h3>
                    <p className="text-sm text-muted-foreground">8 {t("members")}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Calendar className="h-3 w-3 mr-1" />
                        {t("schedule")}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {t("chat")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Discover teams in your area</p>
              <Button>{t("joinTeam")}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  )
}
