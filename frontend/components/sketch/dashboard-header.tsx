"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, ChevronDown, Plus, Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export function DashboardHeader() {
  const { currentProfile, profiles, setCurrentProfile, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 p-4 bg-secondary/20 sketch-border-thin">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search signals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-card sketch-border-thin text-sm w-48 md:w-64 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Live indicator */}
        <Badge variant="outline" className="sketch-border-thin hidden sm:flex">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="sketch-border-thin bg-card hover:bg-secondary/50 gap-2"
            >
              <span className="max-w-[150px] truncate text-sm">
                {currentProfile?.profileName || "Select profile"}
              </span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 sketch-border bg-card">
            <div className="px-2 py-1.5 text-xs text-ink/50 font-medium">Switch profile</div>
            {profiles.map((profile) => (
              <DropdownMenuItem
                key={profile.id}
                onClick={() => setCurrentProfile(profile.id)}
                className="cursor-pointer"
              >
                <span className="flex-1 truncate">{profile.profileName}</span>
                {currentProfile?.id === profile.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profiles/new" className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Create new profile
              </Link>
            </DropdownMenuItem>
            {currentProfile && (
              <DropdownMenuItem asChild>
                <Link href={`/profiles/${currentProfile.id}/edit`} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit current profile
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            4
          </span>
        </Button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center sketch-border-thin">
          <span className="font-sketch text-sm font-bold text-primary">
            {user?.name?.charAt(0) || "?"}
          </span>
        </div>
      </div>
    </header>
  )
}
