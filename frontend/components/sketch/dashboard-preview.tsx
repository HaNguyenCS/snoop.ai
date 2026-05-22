"use client"

import { 
  LayoutDashboard, Users, Zap, Sparkles, Bell, 
  Database, Search, TrendingUp, Filter, Eye,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h2 className="font-sketch text-4xl md:text-5xl font-bold text-ink">
              Your Command Center
            </h2>
            <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 250 15">
              <path d="M0 12 Q60 6 125 10 T250 8" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-primary"/>
            </svg>
          </div>
          <p className="mt-4 text-lg text-ink/70 max-w-2xl mx-auto">
            All your competitor intelligence in one sketchy dashboard
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="sketch-border bg-card p-2 md:p-4 relative">
          {/* Tape decorations */}
          <div className="tape w-16 h-5 absolute -top-3 left-12 -rotate-2 rounded-sm" />
          <div className="tape w-14 h-5 absolute -top-3 right-16 rotate-3 rounded-sm" />
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar */}
            <DashboardSidebar />
            
            {/* Main content */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <DashboardHeader />
              
              {/* KPI Cards */}
              <KpiCards />
              
              {/* Main grid */}
              <div className="grid lg:grid-cols-2 gap-4">
                <CompetitorFeed />
                <div className="space-y-4">
                  <FilteringFunnelMini />
                  <AiInsightsPanel />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doodle annotations */}
        <div className="hidden lg:block">
          <div className="absolute top-32 -left-4 font-sketch text-pencil/40 text-lg -rotate-12">
            {`<-- easy nav`}
          </div>
          <div className="absolute bottom-40 -right-4 font-sketch text-pencil/40 text-lg rotate-6">
            {`AI magic -->`}
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardSidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: Users, label: "Competitors" },
    { icon: Zap, label: "Signals" },
    { icon: Sparkles, label: "Insights" },
    { icon: Bell, label: "Alerts", badge: "4" },
    { icon: Database, label: "Sources" },
  ]

  return (
    <div className="lg:w-48 bg-secondary/30 sketch-border-thin p-3 space-y-1">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-3 mb-2">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Search className="w-3 h-3 text-primary-foreground" />
        </div>
        <span className="font-sketch text-lg font-bold text-ink">snoop.ai</span>
      </div>
      
      {navItems.map((item) => (
        <div
          key={item.label}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
            ${item.active 
              ? 'bg-primary/10 text-primary sketch-border-thin border-primary/30' 
              : 'text-ink/60 hover:bg-secondary/50'
            }
          `}
        >
          <item.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{item.label}</span>
          {item.badge && (
            <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function DashboardHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-secondary/20 sketch-border-thin">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search signals..." 
            className="pl-9 pr-4 py-2 bg-card sketch-border-thin text-sm w-48 focus:outline-none focus:border-primary"
          />
        </div>
        <Badge variant="outline" className="sketch-border-thin">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Live
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink/60">Watching:</span>
        <Badge className="bg-secondary text-ink sketch-border-thin">8 competitors</Badge>
      </div>
    </div>
  )
}

function KpiCards() {
  const kpis = [
    { label: "Updates scanned", value: "1,842", icon: Eye, trend: "up", change: "+12%" },
    { label: "Relevant events", value: "147", icon: Zap, trend: "up", change: "+8%" },
    { label: "Noise filtered", value: "92%", icon: Filter, trend: "same", change: "" },
    { label: "AI insights", value: "27", icon: Sparkles, trend: "up", change: "+5" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((kpi, i) => (
        <div 
          key={kpi.label} 
          className="bg-card sketch-border-thin p-4"
          style={{ transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)` }}
        >
          <div className="flex items-center justify-between mb-2">
            <kpi.icon className="w-5 h-5 text-primary" />
            {kpi.trend === "up" && (
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
            )}
            {kpi.trend === "same" && (
              <Minus className="w-3 h-3 text-ink/40" />
            )}
          </div>
          <div className="font-sketch text-2xl font-bold text-ink">{kpi.value}</div>
          <div className="text-xs text-ink/60">{kpi.label}</div>
        </div>
      ))}
    </div>
  )
}

function CompetitorFeed() {
  const updates = [
    {
      company: "AcmeCo",
      event: "Changed enterprise pricing",
      score: 92,
      time: "2h ago",
      insight: "Possible upmarket push. Review enterprise packaging.",
      type: "pricing"
    },
    {
      company: "LaunchFlow",
      event: "Posted 6 AI infrastructure roles",
      score: 88,
      time: "5h ago",
      insight: "Hiring suggests investment in model serving and AI reliability.",
      type: "hiring"
    },
    {
      company: "Northbeam",
      event: "Published SOC 2 compliance messaging",
      score: 76,
      time: "1d ago",
      insight: "May be positioning for enterprise buyers.",
      type: "content"
    },
  ]

  return (
    <div className="bg-card sketch-border-thin p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sketch text-xl font-bold text-ink">Competitor Feed</h3>
        <Badge variant="outline" className="text-xs">Live updates</Badge>
      </div>
      
      <div className="space-y-3">
        {updates.map((update, i) => (
          <div 
            key={i} 
            className="p-3 bg-secondary/30 rounded-md hover:bg-secondary/50 transition-colors"
            style={{ borderLeft: '3px solid', borderColor: getScoreColor(update.score) }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span className="font-semibold text-ink">{update.company}</span>
                <span className="text-ink/60 text-sm ml-2">{update.time}</span>
              </div>
              <div className={`
                font-sketch text-lg font-bold px-2 rounded
                ${update.score >= 90 ? 'text-red-600 bg-red-50' : ''}
                ${update.score >= 75 && update.score < 90 ? 'text-orange-600 bg-orange-50' : ''}
                ${update.score < 75 ? 'text-ink/60 bg-secondary' : ''}
              `}>
                {update.score}
              </div>
            </div>
            <p className="text-sm text-ink mb-2">{update.event}</p>
            <p className="text-xs text-ink/60 italic bg-highlight/50 px-2 py-1 rounded">
              {`AI: "${update.insight}"`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getScoreColor(score: number) {
  if (score >= 90) return '#dc2626'
  if (score >= 75) return '#ea580c'
  return '#9ca3af'
}

function FilteringFunnelMini() {
  return (
    <div className="bg-sticky-yellow p-4 rounded-sm" style={{ transform: 'rotate(-0.5deg)' }}>
      <h3 className="font-sketch text-lg font-bold text-ink mb-3">Filtering Today</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/70">Raw updates</span>
          <span className="font-sketch font-bold text-ink">1,842</span>
        </div>
        <div className="w-full h-2 bg-ink/10 rounded">
          <div className="h-full bg-ink/30 rounded" style={{ width: '100%' }} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-ink/70">After filter</span>
          <span className="font-sketch font-bold text-ink">147</span>
        </div>
        <div className="w-full h-2 bg-ink/10 rounded">
          <div className="h-full bg-primary/50 rounded" style={{ width: '8%' }} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-ink/70">To AI</span>
          <span className="font-sketch font-bold text-primary">27</span>
        </div>
        <div className="w-full h-2 bg-ink/10 rounded">
          <div className="h-full bg-primary rounded" style={{ width: '1.5%' }} />
        </div>
      </div>
    </div>
  )
}

function AiInsightsPanel() {
  return (
    <div className="bg-card sketch-border-thin p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-sketch text-lg font-bold text-ink">AI Insights</h3>
      </div>
      
      <div className="space-y-2">
        <InsightItem 
          title="Market shift detected"
          description="3 competitors raised enterprise prices this week"
          confidence={94}
        />
        <InsightItem 
          title="Hiring trend"
          description="AI/ML roles up 40% across tracked companies"
          confidence={87}
        />
      </div>
    </div>
  )
}

function InsightItem({ title, description, confidence }: { 
  title: string
  description: string
  confidence: number 
}) {
  return (
    <div className="p-2 bg-secondary/30 rounded-md">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-ink">{title}</span>
        <span className="text-xs text-ink/60">{confidence}% conf</span>
      </div>
      <p className="text-xs text-ink/70">{description}</p>
    </div>
  )
}
