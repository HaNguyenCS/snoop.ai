"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Eye, Zap, Filter, Sparkles, 
  ArrowUpRight, Minus, TrendingUp
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/sketch/app-sidebar"
import { DashboardHeader } from "@/components/sketch/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { mockDashboardData, type ProfileDashboardData } from "@/lib/mock-data"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, currentProfile, setCurrentProfile, profiles } = useAuth()

  // Set default profile if none selected
  useEffect(() => {
    if (isAuthenticated && !currentProfile && profiles.length > 0) {
      setCurrentProfile(profiles[0].id)
    }
  }, [isAuthenticated, currentProfile, profiles, setCurrentProfile])

  // TODO: Replace with proper auth check when backend is ready
  // For demo, we'll allow access

  // Get dashboard data for current profile
  const dashboardData: ProfileDashboardData | undefined = currentProfile 
    ? mockDashboardData[currentProfile.id] || mockDashboardData["profile-1"]
    : mockDashboardData["profile-1"]

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background paper-texture flex items-center justify-center">
        <div className="sketch-border bg-card p-8 text-center">
          <p className="font-sketch text-xl">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background paper-texture flex">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <DashboardHeader />
        
        <div className="p-4 md:p-6 space-y-6">
          {/* Profile indicator */}
          {currentProfile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/50">Monitoring:</span>
              <Badge className="bg-primary/10 text-primary sketch-border-thin font-sketch text-base">
                {currentProfile.profileName}
              </Badge>
              <Badge variant="outline" className="sketch-border-thin">
                {currentProfile.competitors.length} competitors
              </Badge>
            </div>
          )}

          {/* KPI Cards */}
          <KpiCards stats={dashboardData.stats} />

          {/* Main grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <CompetitorFeed updates={dashboardData.competitorUpdates} />
            <div className="space-y-6">
              <FilteringFunnelMini funnel={dashboardData.filteringFunnel} />
              <AiInsightsPanel insights={dashboardData.aiInsights} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function KpiCards({ stats }: { stats: ProfileDashboardData["stats"] }) {
  const kpis = [
    { label: "Updates scanned", value: stats.updatesScanned.toLocaleString(), icon: Eye, trend: "up", change: stats.updatesChange },
    { label: "Relevant events", value: stats.relevantEvents.toString(), icon: Zap, trend: "up", change: stats.eventsChange },
    { label: "Noise filtered", value: `${stats.noiseFiltered}%`, icon: Filter, trend: "same", change: "" },
    { label: "AI insights", value: stats.aiInsights.toString(), icon: Sparkles, trend: "up", change: stats.insightsChange },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div 
          key={kpi.label} 
          className="bg-card sketch-border p-4"
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
          <div className="font-sketch text-3xl font-bold text-ink">{kpi.value}</div>
          <div className="text-sm text-ink/60">{kpi.label}</div>
        </div>
      ))}
    </div>
  )
}

function CompetitorFeed({ updates }: { updates: ProfileDashboardData["competitorUpdates"] }) {
  return (
    <div className="bg-card sketch-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sketch text-2xl font-bold text-ink">Competitor Feed</h3>
        <Badge variant="outline" className="sketch-border-thin">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Live updates
        </Badge>
      </div>
      
      <div className="space-y-3">
        {updates.map((update) => (
          <div 
            key={update.id} 
            className="p-4 bg-secondary/30 rounded-md hover:bg-secondary/50 transition-colors"
            style={{ borderLeft: '3px solid', borderColor: getScoreColor(update.score) }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="font-semibold text-ink">{update.company}</span>
                <span className="text-ink/50 text-sm ml-2">{update.time}</span>
              </div>
              <div className={`
                font-sketch text-lg font-bold px-2 py-0.5 rounded
                ${update.score >= 90 ? 'text-red-600 bg-red-50' : ''}
                ${update.score >= 75 && update.score < 90 ? 'text-orange-600 bg-orange-50' : ''}
                ${update.score < 75 ? 'text-ink/60 bg-secondary' : ''}
              `}>
                {update.score}
              </div>
            </div>
            <p className="text-sm text-ink mb-2">{update.event}</p>
            <p className="text-sm text-ink/60 italic bg-highlight/50 px-3 py-2 rounded">
              AI: &quot;{update.insight}&quot;
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

function FilteringFunnelMini({ funnel }: { funnel: ProfileDashboardData["filteringFunnel"] }) {
  return (
    <div className="bg-sticky-yellow p-5 rounded-sm sketch-border" style={{ transform: 'rotate(-0.3deg)' }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-ink/70" />
        <h3 className="font-sketch text-xl font-bold text-ink">Filtering Today</h3>
      </div>
      
      <div className="space-y-3">
        <FunnelRow label="Raw updates" value={funnel.rawUpdates} percentage={100} />
        <FunnelRow label="After dedup" value={funnel.afterDedup} percentage={(funnel.afterDedup / funnel.rawUpdates) * 100} />
        <FunnelRow label="Relevant signals" value={funnel.relevantSignals} percentage={(funnel.relevantSignals / funnel.rawUpdates) * 100} />
        <FunnelRow label="Sent to AI" value={funnel.sentToAi} percentage={(funnel.sentToAi / funnel.rawUpdates) * 100} highlight />
        <FunnelRow label="Actionable insights" value={funnel.actionableInsights} percentage={(funnel.actionableInsights / funnel.rawUpdates) * 100} highlight />
      </div>
    </div>
  )
}

function FunnelRow({ label, value, percentage, highlight }: { label: string; value: number; percentage: number; highlight?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-ink/70">{label}</span>
        <span className={`font-sketch font-bold ${highlight ? 'text-primary' : 'text-ink'}`}>{value.toLocaleString()}</span>
      </div>
      <div className="w-full h-2 bg-ink/10 rounded">
        <div 
          className={`h-full rounded ${highlight ? 'bg-primary' : 'bg-ink/30'}`} 
          style={{ width: `${Math.max(percentage, 1)}%` }} 
        />
      </div>
    </div>
  )
}

function AiInsightsPanel({ insights }: { insights: ProfileDashboardData["aiInsights"] }) {
  return (
    <div className="bg-card sketch-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-sketch text-xl font-bold text-ink">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="p-3 bg-secondary/30 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-ink">{insight.title}</span>
              <span className="text-xs text-ink/50 bg-secondary px-2 py-0.5 rounded-full">{insight.confidence}% conf</span>
            </div>
            <p className="text-sm text-ink/70">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
