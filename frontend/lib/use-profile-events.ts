"use client"

import { useEffect, useState } from "react"
import { fetchProfileEvents, fetchProfileMetrics } from "@/lib/api"
import {
  EMPTY_DASHBOARD_METRICS,
  computeDashboardMetrics,
  type DashboardMetrics,
} from "@/lib/dashboard-metrics"
import {
  mapEventToAiInsight,
  mapEventToCompetitorPost,
  sortEventsByPriority,
  type CompetitorNewsPost,
} from "@/lib/events"
import type { AiInsight } from "@/lib/mock-data"

const DEFAULT_INSIGHTS_LIMIT = 3
const POLL_INTERVAL_MS = 5000

export function useProfileEvents(
  profileId: string | null | undefined,
  options?: { insightsLimit?: number; monitoredCompetitors?: number },
) {
  const insightsLimit = options?.insightsLimit ?? DEFAULT_INSIGHTS_LIMIT
  const monitoredCompetitors = options?.monitoredCompetitors
  const [posts, setPosts] = useState<CompetitorNewsPost[]>([])
  const [insights, setInsights] = useState<AiInsight[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_DASHBOARD_METRICS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) {
      setPosts([])
      setInsights([])
      setMetrics(EMPTY_DASHBOARD_METRICS)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    let inFlight = false

    async function poll(isInitial: boolean) {
      if (inFlight) return
      inFlight = true
      try {
        if (isInitial) {
          setLoading(true)
        }
        setError(null)

        const [events, apiMetrics] = await Promise.all([
          fetchProfileEvents(profileId!),
          fetchProfileMetrics(profileId!),
        ])

        if (cancelled) return

        const sorted = sortEventsByPriority(events)
        setPosts(sorted.map(mapEventToCompetitorPost))
        setInsights(sorted.slice(0, insightsLimit).map(mapEventToAiInsight))
        setMetrics(
          computeDashboardMetrics(events, apiMetrics, { monitoredCompetitors }),
        )
      } catch (err) {
        if (cancelled) return
        if (isInitial) {
          setPosts([])
          setInsights([])
          setMetrics(EMPTY_DASHBOARD_METRICS)
        }
        setError(err instanceof Error ? err.message : "Failed to load profile data")
      } finally {
        inFlight = false
        if (!cancelled && isInitial) {
          setLoading(false)
        }
      }
    }

    void poll(true)

    const intervalId = window.setInterval(() => {
      void poll(false)
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [profileId, insightsLimit, monitoredCompetitors])

  return { posts, insights, metrics, loading, error }
}
