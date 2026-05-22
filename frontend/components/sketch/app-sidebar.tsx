"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, Users, Zap, Sparkles, Bell, 
  Database, Settings, LogOut, ChevronLeft, ChevronRight,
  FolderOpen, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/sketch/logo"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Profiles", href: "/profiles" },
  { icon: Users, label: "Competitors", href: "/dashboard/competitors" },
  { icon: Zap, label: "Signals", href: "/dashboard/signals" },
  { icon: Sparkles, label: "Insights", href: "/dashboard/insights" },
  { icon: Bell, label: "Alerts", href: "/dashboard/alerts", badge: "4" },
  { icon: Database, label: "Sources", href: "/dashboard/sources" },
]

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout, currentProfile } = useAuth()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <aside 
      className={cn(
        "bg-secondary/30 sketch-border-thin border-r-0 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-3 border-b border-ink/10",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
        ) : (
          <Logo size="small" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "hidden")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mx-auto mt-2"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Current profile indicator */}
      {!collapsed && currentProfile && (
        <div className="mx-3 mt-3 p-2 bg-sticky-yellow rounded-sm" style={{ transform: 'rotate(-0.5deg)' }}>
          <p className="text-xs text-ink/60">Monitoring:</p>
          <p className="font-sketch text-sm font-bold text-ink truncate">{currentProfile.profileName}</p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                collapsed && "justify-center",
                isActive 
                  ? "bg-primary/10 text-primary sketch-border-thin border-primary/30" 
                  : "text-ink/60 hover:bg-secondary/50 hover:text-ink"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}

        {/* New profile shortcut */}
        <Link
          href="/profiles/new"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-ink/60 hover:bg-secondary/50 hover:text-ink border border-dashed border-ink/20",
            collapsed && "justify-center"
          )}
          title={collapsed ? "New Profile" : undefined}
        >
          <Plus className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">New Profile</span>}
        </Link>
      </nav>

      {/* Bottom nav */}
      <div className="p-2 border-t border-ink/10 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                collapsed && "justify-center",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-ink/60 hover:bg-secondary/50 hover:text-ink"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
        
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-ink/60 hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
