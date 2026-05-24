"use client"

import { useEffect, useState } from "react"
import { fetchProfileEvents } from "@/lib/api"
import {
  mapEventToAiInsight,
  mapEventToCompetitorPost,
  sortEventsByPriority,
  type CompetitorNewsPost,
} from "@/lib/events"
import type { AiInsight } from "@/lib/mock-data"

const DEFAULT_INSIGHTS_LIMIT = 3
const POLL_INTERVAL_MS = 1000

export function useProfileEvents(
  profileId: string | null | undefined,
  options?: { insightsLimit?: number },
) {
  const insightsLimit = options?.insightsLimit ?? DEFAULT_INSIGHTS_LIMIT
  const [posts, setPosts] = useState<CompetitorNewsPost[]>([])
  const [insights, setInsights] = useState<AiInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) {
      setPosts([])
      setInsights([])
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
        const events = await fetchProfileEvents(profileId!)
        if (cancelled) return
        const sorted = sortEventsByPriority(events)
        setPosts(sorted.map(mapEventToCompetitorPost))
        setInsights(sorted.slice(0, insightsLimit).map(mapEventToAiInsight))
      } catch (err) {
        if (cancelled) return
        if (isInitial) {
          setPosts([])
          setInsights([])
        }
        setError(err instanceof Error ? err.message : "Failed to load events")
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
  }, [profileId, insightsLimit])

  return { posts, insights, loading, error }
}
