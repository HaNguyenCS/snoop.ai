import type { AiInsight } from "@/lib/mock-data"
import type { ScraperEventResponse } from "@/lib/api"
import { parseApiDate } from "@/lib/format-time"

export type Verdict = "High" | "Medium" | "Low" | "None"

export interface CompetitorNewsPost {
  company: string
  source_url: string
  posted_at: string
  is_relevant: boolean
  verdict: Verdict
  summary: string
  action_item: string
}

const verdictRank: Record<Verdict, number> = {
  High: 4,
  Medium: 3,
  Low: 2,
  None: 1,
}

function parseVerdict(verdict: string | null | undefined): Verdict {
  if (verdict === "High" || verdict === "Medium" || verdict === "Low" || verdict === "None") {
    return verdict
  }
  return "None"
}

export function verdictToConfidence(verdict: string | null | undefined): number {
  switch (parseVerdict(verdict)) {
    case "High":
      return 90
    case "Medium":
      return 75
    case "Low":
      return 55
    case "None":
      return 30
    default:
      return 50
  }
}

function eventTimestamp(event: ScraperEventResponse): string {
  return event.detected_at ?? event.created_at ?? new Date().toISOString()
}

function eventTimeMs(event: ScraperEventResponse): number {
  return parseApiDate(eventTimestamp(event))?.getTime() ?? 0
}

export function mapEventToCompetitorPost(event: ScraperEventResponse): CompetitorNewsPost {
  return {
    company: event.matched_keyword ?? "Unknown",
    source_url: event.url ?? "#",
    posted_at: eventTimestamp(event),
    is_relevant: true,
    verdict: parseVerdict(event.verdict),
    summary: event.summary ?? event.text ?? "No summary available.",
    action_item: event.action_item ?? "",
  }
}

export function mapEventToAiInsight(event: ScraperEventResponse): AiInsight {
  return {
    id: String(event.id),
    title: event.category ?? event.matched_keyword ?? "Insight",
    description: event.summary ?? event.text ?? "",
    confidence: verdictToConfidence(event.verdict),
    createdAt: eventTimestamp(event),
  }
}

export type FeedSortOption = "priority" | "newest" | "oldest" | "company"

export const FEED_SORT_LABELS: Record<FeedSortOption, string> = {
  priority: "Priority",
  newest: "Newest first",
  oldest: "Oldest first",
  company: "Company A–Z",
}

function postTimeMs(post: CompetitorNewsPost): number {
  return parseApiDate(post.posted_at)?.getTime() ?? 0
}

export function sortCompetitorPosts(
  posts: CompetitorNewsPost[],
  sort: FeedSortOption,
): CompetitorNewsPost[] {
  const copy = [...posts]

  switch (sort) {
    case "newest":
      return copy.sort((a, b) => postTimeMs(b) - postTimeMs(a))
    case "oldest":
      return copy.sort((a, b) => postTimeMs(a) - postTimeMs(b))
    case "company":
      return copy.sort((a, b) =>
        a.company.localeCompare(b.company, undefined, { sensitivity: "base" }),
      )
    case "priority":
    default:
      return copy.sort((a, b) => {
        const verdictDiff = verdictRank[b.verdict] - verdictRank[a.verdict]
        if (verdictDiff !== 0) return verdictDiff
        return postTimeMs(b) - postTimeMs(a)
      })
  }
}

export function sortEventsByPriority(events: ScraperEventResponse[]): ScraperEventResponse[] {
  return [...events].sort((a, b) => {
    const verdictDiff =
      verdictRank[parseVerdict(b.verdict)] - verdictRank[parseVerdict(a.verdict)]

    if (verdictDiff !== 0) {
      return verdictDiff
    }

    return eventTimeMs(b) - eventTimeMs(a)
  })
}
