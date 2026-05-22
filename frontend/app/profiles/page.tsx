"use client"

import Link from "next/link"
import { Plus, Settings, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppSidebar } from "@/components/sketch/app-sidebar"
import { DashboardHeader } from "@/components/sketch/dashboard-header"
import { useAuth } from "@/lib/auth-context"

export default function ProfilesPage() {
  const { profiles, currentProfile, setCurrentProfile } = useAuth()

  return (
    <div className="min-h-screen bg-background paper-texture flex">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <DashboardHeader />
        
        <div className="p-4 md:p-6">
          {/* Page header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-sketch text-3xl md:text-4xl font-bold text-ink">Profiles</h1>
              <p className="mt-2 text-ink/60">Manage your monitoring profiles</p>
            </div>
            <Link href="/profiles/new">
              <Button className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-lg">
                <Plus className="w-5 h-5 mr-2" />
                New Profile
              </Button>
            </Link>
          </div>

          {/* Helper note */}
          <div className="mb-6 p-4 bg-sticky-blue rounded-sm max-w-2xl" style={{ transform: 'rotate(-0.3deg)' }}>
            <p className="font-sketch text-lg text-ink">
              Each profile monitors a different set of competitors. Use profiles to separate monitoring for different products or clients.
            </p>
          </div>

          {/* Profiles grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile, i) => (
              <div 
                key={profile.id} 
                className={`sketch-border bg-card p-5 relative ${currentProfile?.id === profile.id ? 'ring-2 ring-primary' : ''}`}
                style={{ transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)` }}
              >
                {currentProfile?.id === profile.id && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                    Active
                  </Badge>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-sketch text-xl font-bold text-ink">{profile.profileName}</h3>
                    <p className="text-sm text-ink/60">{profile.companyName}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="sketch-border bg-card">
                      <DropdownMenuItem onClick={() => setCurrentProfile(profile.id)}>
                        Set as active
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profiles/${profile.id}/edit`}>
                          <Settings className="w-4 h-4 mr-2" />
                          Edit profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          // TODO: Implement profile deletion
                          alert("Profile deletion would be implemented here")
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="sketch-border-thin">
                      {profile.industry}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink/50">{profile.website}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="text-xs text-ink/60">
                    <span className="font-semibold text-ink">{profile.competitors.length}</span> competitors
                  </div>
                  <span className="text-ink/30">|</span>
                  <div className="text-xs text-ink/60">
                    <span className="font-semibold text-ink">{profile.keywords.length}</span> keywords
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="sketch-border-thin flex-1"
                    onClick={() => setCurrentProfile(profile.id)}
                  >
                    View Dashboard
                  </Button>
                  <Link href={`/profiles/${profile.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Add new profile card */}
            <Link href="/profiles/new">
              <div 
                className="sketch-border-thin border-dashed bg-secondary/20 p-5 flex flex-col items-center justify-center min-h-[200px] hover:bg-secondary/40 transition-colors cursor-pointer"
                style={{ transform: 'rotate(0.3deg)' }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <p className="font-sketch text-lg text-ink/70">Create new profile</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
