"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Bell, 
  ChevronDown,
  Radio
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function DashboardHeader() {
  return (
    <header className="h-16 bg-card/50 border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search competitors, signals, insights..." 
            className="pl-10 bg-background/50 border-border"
          />
        </div>
        
        {/* Company selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                A
              </div>
              Acme Corp
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mr-2">
                A
              </div>
              Acme Corp
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center text-xs font-bold text-accent mr-2">
                N
              </div>
              Northstar Labs
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="w-5 h-5 rounded bg-chart-3/20 flex items-center justify-center text-xs font-bold text-chart-3 mr-2">
                B
              </div>
              BrightCart
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <Badge variant="outline" className="gap-1.5 bg-chart-3/10 border-chart-3/30 text-chart-3">
          <Radio className="w-3 h-3 animate-pulse" />
          Live
        </Badge>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground font-medium">
            4
          </span>
        </Button>
        
        {/* User avatar */}
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary/20 text-primary text-sm">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
