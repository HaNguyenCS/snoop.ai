"use client"

import { useEffect } from "react"
import {
  Clock,
  Zap,
  Users,
  Target,
  Sparkles,
  ArrowUpRight,
  Minus,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/sketch/app-sidebar"
import { DashboardHeader } from "@/components/sketch/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import type { AiInsight } from "@/lib/mock-data"
import type { DashboardFunnel, DashboardStats } from "@/lib/dashboard-metrics"
import { CompetitorFeedPanel } from "@/components/dashboard/competitor-feed-panel"
import { useProfileEvents } from "@/lib/use-profile-events"

const INSIGHTS_LIMIT = 3

export default function DashboardPage() {
  const { isAuthenticated, currentProfile, setCurrentProfile, profiles } = useAuth()
  const { posts, insights, metrics, loading, error } = useProfileEvents(
    currentProfile?.id,
    {
      insightsLimit: INSIGHTS_LIMIT,
      monitoredCompetitors: currentProfile?.competitors.length,
    },
  )

  useEffect(() => {
    if (isAuthenticated && !currentProfile && profiles.length > 0) {
      setCurrentProfile(profiles[0].id)
    }
  }, [isAuthenticated, currentProfile, profiles, setCurrentProfile])

  return (
    <div className="min-h-screen bg-background paper-texture flex">
      <AppSidebar />

      <div className="flex-1 overflow-auto">
        <DashboardHeader />

        <div className="p-4 md:p-6 space-y-6">
          {currentProfile ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-ink/50">Monitoring:</span>
              <Badge className="bg-primary/10 text-primary sketch-border-thin font-sketch text-base">
                {currentProfile.profileName}
              </Badge>
              <Badge variant="outline" className="sketch-border-thin">
                {currentProfile.competitors.length} competitors
              </Badge>
              {metrics.topCompetitor !== "N/A" ? (
                <Badge variant="outline" className="sketch-border-thin">
                  Top signal: {metrics.topCompetitor}
                </Badge>
              ) : null}
            </div>
          ) : null}

          <KpiCards stats={metrics.stats} loading={loading} />

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
              <FilteringFunnelMini funnel={metrics.filteringFunnel} loading={loading} />
              <AiInsightsPanel insights={insights} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCards({
  stats,
  loading,
}: {
  stats: DashboardStats
  loading: boolean
}) {
  const kpis = [
    {
      label: "Time saved",
      value: loading ? "—" : `${stats.timeSavedHours}h`,
      icon: Clock,
      trend: "same" as const,
      change: "",
    },
    {
      label: "Relevant events",
      value: loading ? "—" : stats.relevantEvents.toString(),
      icon: Zap,
      trend: "same" as const,
      change: "",
    },
    {
      label: "Active competitors",
      value: loading
        ? "—"
        : stats.monitoredCompetitors
          ? `${stats.activeCompetitors}/${stats.monitoredCompetitors}`
          : stats.activeCompetitors.toString(),
      icon: Users,
      trend: stats.activeCompetitorsChange ? "up" : "same",
      change: stats.activeCompetitorsChange,
    },
    {
      label: "High priority",
      value: loading ? "—" : stats.highPriorityAlerts.toString(),
      icon: Target,
      trend: stats.highPriorityChange ? "up" : "same",
      change: stats.highPriorityChange,
    },
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
            {kpi.trend === "up" && kpi.change ? (
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
            ) : null}
            {kpi.trend === "same" ? (
              <Minus className="w-3 h-3 text-ink/40" />
            ) : null}
          </div>
          <div className="font-sketch text-3xl font-bold text-ink">{kpi.value}</div>
          <div className="text-sm text-ink/60">{kpi.label}</div>
        </div>
      ))}
    </div>
  )
}

function FilteringFunnelMini({
  funnel,
  loading,
}: {
  funnel: DashboardFunnel
  loading: boolean
}) {
  const baseCount = funnel.events24h || 1

  return (
    <div
      className="bg-sticky-yellow p-5 rounded-sm sketch-border"
      style={{ transform: "rotate(-0.3deg)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-ink/70" />
        <h3 className="font-sketch text-xl font-bold text-ink">Priority breakdown (24h)</h3>
      </div>

      {loading ? (
        <p className="text-sm text-ink/60">Loading funnel...</p>
      ) : funnel.events24h === 0 ? (
        <p className="text-sm text-ink/60">No events in the last 24 hours yet.</p>
      ) : (
        <div className="space-y-3">
          <FunnelRow
            label="Events detected"
            value={funnel.events24h}
            percentage={100}
          />
          <FunnelRow
            label="High or medium"
            value={funnel.highOrMedium}
            percentage={(funnel.highOrMedium / baseCount) * 100}
          />
          <FunnelRow
            label="High priority"
            value={funnel.highPriority}
            percentage={(funnel.highPriority / baseCount) * 100}
          />
          <FunnelRow
            label="With action items"
            value={funnel.withActionItems}
            percentage={(funnel.withActionItems / baseCount) * 100}
            highlight
          />
        </div>
      )}
    </div>
  )
}

function FunnelRow({
  label,
  value,
  percentage,
  highlight,
}: {
  label: string
  value: number
  percentage: number
  highlight?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-ink/70">{label}</span>
        <span
          className={`font-sketch font-bold ${highlight ? "text-primary" : "text-ink"}`}
        >
          {value.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-2 bg-ink/10 rounded">
        <div
          className={`h-full rounded ${highlight ? "bg-primary" : "bg-ink/30"}`}
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
                <span className="text-xs text-ink/50 bg-secondary px-2 py-0.5 rounded-full">
                  {insight.confidence}% conf
                </span>
              </div>
              <p className="text-sm text-ink/70">{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
