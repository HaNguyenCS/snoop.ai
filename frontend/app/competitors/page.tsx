"use client"

import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { AppSidebar } from "@/components/sketch/app-sidebar"
import { DashboardHeader } from "@/components/sketch/dashboard-header"
import { CompetitorFeed } from "@/components/dashboard/competitor-feed"
import { useProfileEvents } from "@/lib/use-profile-events"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

export default function CompetitorsPage() {
  const { profiles, currentProfile, setCurrentProfile } = useAuth()
  const { posts, loading, error } = useProfileEvents(currentProfile?.id)

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background paper-texture flex">
        <AppSidebar />

        <main className="flex-1 overflow-auto">
          <DashboardHeader />

          <div className="p-6">
            <div className="sketch-border bg-card p-6 max-w-xl">
              <h1 className="font-sketch text-3xl font-bold text-ink mb-2">
                No active profile selected
              </h1>

              <p className="text-ink/60 mb-4">
                Select or create a monitoring profile to view competitor posts.
              </p>

              <Link href="/profiles">
                <Button className="sketch-border bg-primary text-primary-foreground">
                  Go to Profiles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background paper-texture flex">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <DashboardHeader />

        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-sketch text-3xl md:text-4xl font-bold text-ink">
                Competitor Feed
              </h1>

              <p className="mt-2 text-ink/60">
                Ranked by verdict priority and recency for{" "}
                <span className="font-semibold text-ink">
                  {currentProfile.profileName}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="sketch-border-thin">
                  {currentProfile.companyName}
                </Badge>

                <Badge variant="outline" className="sketch-border-thin">
                  {currentProfile.competitors.length} competitors
                </Badge>
              </div>
            </div>

            <Link href="/profiles/new">
              <Button className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-lg">
                <Plus className="w-5 h-5 mr-2" />
                New Profile
              </Button>
            </Link>
          </div>

          <div className="sketch-border bg-card p-4">
            <p className="text-sm text-ink/60 mb-3">
              Change monitoring profile
            </p>

            <div className="flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <Button
                  key={profile.id}
                  variant={
                    currentProfile.id === profile.id ? "default" : "outline"
                  }
                  className="sketch-border-thin"
                  onClick={() => setCurrentProfile(profile.id)}
                >
                  {profile.profileName}
                </Button>
              ))}
            </div>
          </div>

          <div className="sketch-border bg-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-sketch text-xl font-bold text-ink">Recent events</h2>
              <span className="font-sketch text-xl font-bold text-primary tabular-nums">
                {posts.length}
              </span>
            </div>
            <CompetitorFeed posts={posts} loading={loading} error={error} />
          </div>
        </div>
      </main>
    </div>
  )
}