import type { ProfileMetricsResponse, ScraperEventResponse } from "@/lib/api"
import { parseApiDate } from "@/lib/format-time"

export interface DashboardStats {
  eventsLast24h: number
  relevantEvents: number
  activeCompetitors: number
  monitoredCompetitors: number | null
  highPriorityAlerts: number
  withActionItems: number
  timeSavedHours: number
  events24hChange: string
  activeCompetitorsChange: string
  highPriorityChange: string
}

export interface DashboardFunnel {
  events24h: number
  highOrMedium: number
  highPriority: number
  withActionItems: number
}

export interface DashboardMetrics {
  stats: DashboardStats
  filteringFunnel: DashboardFunnel
  topCompetitor: string
  competitorHits: Record<string, number>
}

function eventTimeMs(event: ScraperEventResponse): number {
  const timestamp =
    event.detected_at ?? event.created_at ?? new Date().toISOString()
  return parseApiDate(timestamp)?.getTime() ?? 0
}

function formatPercentChange(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? "+100%" : ""
  }

  const change = Math.round(((current - previous) / previous) * 100)
  if (change === 0) return "0%"
  return `${change > 0 ? "+" : ""}${change}%`
}

function eventsInRange(
  events: ScraperEventResponse[],
  startMs: number,
  endMs = Number.POSITIVE_INFINITY,
): ScraperEventResponse[] {
  return events.filter((event) => {
    const time = eventTimeMs(event)
    return time >= startMs && time < endMs
  })
}

function uniqueCompetitors(events: ScraperEventResponse[]): number {
  return new Set(events.map((event) => event.matched_keyword ?? "Unknown")).size
}

function countVerdicts(
  events: ScraperEventResponse[],
  verdicts: string[],
): number {
  return events.filter((event) => event.verdict && verdicts.includes(event.verdict))
    .length
}

function countWithActionItems(events: ScraperEventResponse[]): number {
  return events.filter(
    (event) => event.action_item && event.action_item.trim().length > 0,
  ).length
}

const MINUTES_PER_INSIGHT = 20

function computeTimeSavedHours(storedCount: number): number {
  return Math.round(((storedCount * MINUTES_PER_INSIGHT) / 60) * 10) / 10
}

export function computeDashboardMetrics(
  events: ScraperEventResponse[],
  apiMetrics: ProfileMetricsResponse,
  options?: { monitoredCompetitors?: number },
): DashboardMetrics {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const last24hStart = now - dayMs
  const prev24hStart = now - 2 * dayMs

  const eventsLast24hList = eventsInRange(events, last24hStart)
  const eventsPrev24hList = eventsInRange(events, prev24hStart, last24hStart)

  const funnelEvents =
    eventsLast24hList.length > 0 ? eventsLast24hList : events

  const highPriorityLast24h = countVerdicts(eventsLast24hList, ["High"])
  const highPriorityPrev24h = countVerdicts(eventsPrev24hList, ["High"])

  return {
    stats: {
      eventsLast24h: eventsLast24hList.length,
      relevantEvents: apiMetrics.insights_generated,
      activeCompetitors: Object.keys(apiMetrics.competitor_hits).length,
      monitoredCompetitors: options?.monitoredCompetitors ?? null,
      highPriorityAlerts: apiMetrics.high_priority_alerts,
      withActionItems: countWithActionItems(events),
      timeSavedHours: computeTimeSavedHours(apiMetrics.insights_generated),
      events24hChange: formatPercentChange(
        eventsLast24hList.length,
        eventsPrev24hList.length,
      ),
      activeCompetitorsChange: formatPercentChange(
        uniqueCompetitors(eventsLast24hList),
        uniqueCompetitors(eventsPrev24hList),
      ),
      highPriorityChange: formatPercentChange(
        highPriorityLast24h,
        highPriorityPrev24h,
      ),
    },
    filteringFunnel: {
      events24h: funnelEvents.length,
      highOrMedium: countVerdicts(funnelEvents, ["High", "Medium"]),
      highPriority: countVerdicts(funnelEvents, ["High"]),
      withActionItems: countWithActionItems(funnelEvents),
    },
    topCompetitor: apiMetrics.top_competitor,
    competitorHits: apiMetrics.competitor_hits,
  }
}

export const EMPTY_DASHBOARD_METRICS: DashboardMetrics = {
  stats: {
    eventsLast24h: 0,
    relevantEvents: 0,
    activeCompetitors: 0,
    monitoredCompetitors: null,
    highPriorityAlerts: 0,
    withActionItems: 0,
    timeSavedHours: 0,
    events24hChange: "",
    activeCompetitorsChange: "",
    highPriorityChange: "",
  },
  filteringFunnel: {
    events24h: 0,
    highOrMedium: 0,
    highPriority: 0,
    withActionItems: 0,
  },
  topCompetitor: "N/A",
  competitorHits: {},
}
