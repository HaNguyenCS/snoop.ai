"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  Radio, 
  Brain, 
  Bell, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Target,
  ArrowLeft
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  onBack: () => void
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "competitors", label: "Competitors", icon: Users },
  { id: "signals", label: "Signals", icon: Radio },
  { id: "insights", label: "AI Insights", icon: Brain },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "sources", label: "Sources", icon: Database },
  { id: "settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ activeTab, onTabChange, collapsed, onToggleCollapse, onBack }: SidebarProps) {
  return (
    <aside className={cn(
      "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">snoop.ai</span>
          </button>
        )}
        {collapsed && (
          <button onClick={onBack} className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mx-auto hover:opacity-80 transition-opacity">
            <Target className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {/* Back to Landing */}
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Back to Home</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === item.id && "bg-sidebar-accent text-sidebar-accent-foreground",
              collapsed && "justify-center px-2"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id && "text-primary")} />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  )
}
