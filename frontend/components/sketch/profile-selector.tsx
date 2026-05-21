"use client"

import { ChevronDown, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function ProfileSelector() {
  const { currentProfile, profiles, setCurrentProfile } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="sketch-border bg-card hover:bg-secondary/50 gap-2 w-full justify-between"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-ink/50">Current profile</span>
            <span className="font-sketch text-lg truncate max-w-[200px]">
              {currentProfile?.profileName || "No profile selected"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 sketch-border bg-card">
        <div className="px-2 py-1.5 text-xs text-ink/50 font-medium">Your profiles</div>
        {profiles.map((profile) => (
          <DropdownMenuItem
            key={profile.id}
            onClick={() => setCurrentProfile(profile.id)}
            className="cursor-pointer flex items-start gap-3 p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{profile.profileName}</p>
              <p className="text-xs text-ink/50 truncate">{profile.companyName}</p>
            </div>
            {currentProfile?.id === profile.id && (
              <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
