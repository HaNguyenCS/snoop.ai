"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchProfileEvents } from "@/lib/api"
import {
  mapEventToAiInsight,
  mapEventToCompetitorPost,
  sortEventsByPriority,
  type CompetitorNewsPost,
} from "@/lib/events"
import type { AiInsight } from "@/lib/mock-data"

const DEFAULT_INSIGHTS_LIMIT = 3
const POLL_INTERVAL_MS = 3000

export function useProfileEvents(
  profileId: string | null | undefined,
  options?: { insightsLimit?: number },
) {
  const insightsLimit = options?.insightsLimit ?? DEFAULT_INSIGHTS_LIMIT
  const [posts, setPosts] = useState<CompetitorNewsPost[]>([])
  const [insights, setInsights] = useState<AiInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (isPoll: boolean) => {
      if (!profileId) {
        setPosts([])
        setInsights([])
        setError(null)
        setLoading(false)
        return
      }

      if (!isPoll) {
        setLoading(true)
      }
      setError(null)

      try {
        const events = await fetchProfileEvents(profileId)
        const sorted = sortEventsByPriority(events)
        setPosts(sorted.map(mapEventToCompetitorPost))
        setInsights(sorted.slice(0, insightsLimit).map(mapEventToAiInsight))
      } catch (err) {
        if (!isPoll) {
          setPosts([])
          setInsights([])
        }
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        if (!isPoll) {
          setLoading(false)
        }
      }
    },
    [profileId, insightsLimit],
  )

  useEffect(() => {
    if (!profileId) {
      setPosts([])
      setInsights([])
      setError(null)
      setLoading(false)
      return
    }

    void load(false)

    const intervalId = window.setInterval(() => {
      void load(true)
    }, POLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [profileId, load])

  return { posts, insights, loading, error }
}
