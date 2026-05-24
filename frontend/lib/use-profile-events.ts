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

export function useProfileEvents(
  profileId: string | null | undefined,
  options?: { insightsLimit?: number },
) {
  const insightsLimit = options?.insightsLimit ?? DEFAULT_INSIGHTS_LIMIT
  const [posts, setPosts] = useState<CompetitorNewsPost[]>([])
  const [insights, setInsights] = useState<AiInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (isRefresh: boolean) => {
      if (!profileId) {
        setPosts([])
        setInsights([])
        setError(null)
        setLoading(false)
        setRefreshing(false)
        return
      }

      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const events = await fetchProfileEvents(profileId)
        const sorted = sortEventsByPriority(events)
        setPosts(sorted.map(mapEventToCompetitorPost))
        setInsights(sorted.slice(0, insightsLimit).map(mapEventToAiInsight))
      } catch (err) {
        setPosts([])
        setInsights([])
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [profileId, insightsLimit],
  )

  useEffect(() => {
    void load(false)
  }, [load])

  const refresh = useCallback(() => {
    void load(true)
  }, [load])

  return { posts, insights, loading, refreshing, error, refresh }
}
