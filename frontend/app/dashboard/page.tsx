"use client"

import { useEffect } from "react"
import { 
  Eye, Zap, Filter, Sparkles, 
  ArrowUpRight, Minus, TrendingUp
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/sketch/app-sidebar"
import { DashboardHeader } from "@/components/sketch/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { mockDashboardData, type AiInsight, type ProfileDashboardData } from "@/lib/mock-data"
import { CompetitorFeedPanel } from "@/components/dashboard/competitor-feed-panel"
import { useProfileEvents } from "@/lib/use-profile-events"

const INSIGHTS_LIMIT = 3

export default function DashboardPage() {
  const { isAuthenticated, currentProfile, setCurrentProfile, profiles } = useAuth()
  const { posts, insights, loading, error } = useProfileEvents(
    currentProfile?.id,
    { insightsLimit: INSIGHTS_LIMIT },
  )

  // Set default profile if none selected
  useEffect(() => {
    if (isAuthenticated && !currentProfile && profiles.length > 0) {
      setCurrentProfile(profiles[0].id)
    }
  }, [isAuthenticated, currentProfile, profiles, setCurrentProfile])

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
            <div className="bg-card sketch-border p-5">
              <CompetitorFeedPanel
                posts={posts}
                loading={loading}
                error={error}
                limit={5}
                showLiveBadge
              />
            </div>

            <div className="space-y-6">
              <FilteringFunnelMini funnel={dashboardData.filteringFunnel} />
              <AiInsightsPanel insights={insights} loading={loading} />
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

function AiInsightsPanel({
  insights,
  loading,
}: {
  insights: AiInsight[]
  loading: boolean
}) {
  return (
    <div className="bg-card sketch-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-sketch text-xl font-bold text-ink">AI Insights</h3>
      </div>

      {loading ? (
        <p className="text-sm text-ink/60">Loading insights...</p>
      ) : insights.length === 0 ? (
        <p className="text-sm text-ink/60">No insights yet.</p>
      ) : (
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
      )}
    </div>
  )
}
