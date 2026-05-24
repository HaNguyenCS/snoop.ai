"use client"

import { ArrowUpRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/mock-data"

type Verdict = "High" | "Medium" | "Low" | "None"

type Category =
  | "Supply Chain"
  | "Geopolitical"
  | "Competitor"
  | "Regulation"
  | "Market Sentiment"

export interface CompetitorNewsPost {
  company: string
  source_url: string
  posted_at: string
  is_relevant: boolean
  verdict: Verdict
  category: Category
  summary: string
  action_item: string
}

interface CompetitorFeedProps {
  posts?: CompetitorNewsPost[]
  limit?: number
  currentProfile?: Profile | null
}

const mockPostsByProfile: Record<string, CompetitorNewsPost[]> = {
  "1": [
    {
      company: "Netflix",
      source_url: "https://example.com/netflix-ad-plan",
      posted_at: "2026-05-22T14:30:00Z",
      is_relevant: true,
      verdict: "High",
      category: "Competitor",
      summary: "Netflix expanded its ad-supported plan with new targeting tools for advertisers.",
      action_item: "Review whether our ad-tier positioning and pricing remain competitive.",
    },
    {
      company: "Disney+",
      source_url: "https://example.com/disney-bundle",
      posted_at: "2026-05-22T13:45:00Z",
      is_relevant: true,
      verdict: "High",
      category: "Market Sentiment",
      summary: "Disney+ promoted a new bundle strategy across streaming and live sports.",
      action_item: "Assess whether bundling pressure could increase churn risk for standalone streaming plans.",
    },
    {
      company: "Amazon Prime Video",
      source_url: "https://example.com/prime-video-ads",
      posted_at: "2026-05-22T12:50:00Z",
      is_relevant: true,
      verdict: "Medium",
      category: "Competitor",
      summary: "Amazon Prime Video updated its advertising format for premium video inventory.",
      action_item: "Compare ad-load and advertiser value proposition against our own media strategy.",
    },
    {
      company: "Hulu",
      source_url: "https://example.com/hulu-originals",
      posted_at: "2026-05-22T11:10:00Z",
      is_relevant: true,
      verdict: "Medium",
      category: "Competitor",
      summary: "Hulu announced a slate of new original content targeting younger viewers.",
      action_item: "Track whether content investment shifts audience share in key demographics.",
    },
    {
      company: "Hulu",
      source_url: "https://example.com/hulu-originals",
      posted_at: "2026-05-22T11:10:00Z",
      is_relevant: true,
      verdict: "Medium",
      category: "Competitor",
      summary: "Hulu announced a slate of new original content targeting younger viewers.",
      action_item: "Track whether content investment shifts audience share in key demographics.",
    },
    {
      company: "HBO Max",
      source_url: "https://example.com/hbo-max-international",
      posted_at: "2026-05-21T22:20:00Z",
      is_relevant: true,
      verdict: "Low",
      category: "Geopolitical",
      summary: "HBO Max highlighted international expansion in selected markets.",
      action_item: "Monitor regional expansion to identify future subscriber growth pressure.",
    },
  ],

  "2": [
    {
      company: "Apple Music",
      source_url: "https://example.com/apple-music-subscription-update",
      posted_at: "2026-05-22T15:10:00Z",
      is_relevant: true,
      verdict: "High",
      category: "Competitor",
      summary: "Apple Music expanded bundled subscription options for music and entertainment services.",
      action_item: "Review whether Spotify’s bundle positioning is still competitive against Apple’s ecosystem advantage.",
    },
    {
      company: "YouTube Music",
      source_url: "https://example.com/youtube-music-podcast-push",
      posted_at: "2026-05-22T14:35:00Z",
      is_relevant: true,
      verdict: "High",
      category: "Market Sentiment",
      summary: "YouTube Music increased promotion of podcasts and creator-led audio content.",
      action_item: "Monitor whether YouTube’s creator ecosystem weakens Spotify’s podcast differentiation.",
    },
    {
      company: "Amazon Music",
      source_url: "https://example.com/amazon-music-audiobooks",
      posted_at: "2026-05-22T12:50:00Z",
      is_relevant: true,
      verdict: "Medium",
      category: "Competitor",
      summary: "Amazon Music added new audiobook discovery features for premium subscribers.",
      action_item: "Compare audiobook discovery and bundling against Spotify’s premium experience.",
    },
    {
      company: "SoundCloud",
      source_url: "https://example.com/soundcloud-creator-tools",
      posted_at: "2026-05-22T11:20:00Z",
      is_relevant: true,
      verdict: "Medium",
      category: "Competitor",
      summary: "SoundCloud released creator monetization updates targeting independent artists.",
      action_item: "Evaluate whether Spotify needs stronger creator-facing tools for independent musicians.",
    },
    {
      company: "SoundCloud",
      source_url: "https://example.com/soundcloud-creator-tools",
      posted_at: "2026-05-22T11:20:00Z",
      is_relevant: true,
      verdict: "Medium",
      category: "Competitor",
      summary: "SoundCloud released creator monetization updates targeting independent artists.",
      action_item: "Evaluate whether Spotify needs stronger creator-facing tools for independent musicians.",
    },
    {
      company: "Tidal",
      source_url: "https://example.com/tidal-hi-fi-pricing",
      posted_at: "2026-05-21T22:00:00Z",
      is_relevant: true,
      verdict: "Low",
      category: "Market Sentiment",
      summary: "Tidal adjusted messaging around high-fidelity streaming quality.",
      action_item: "Track whether audio quality becomes more important in premium subscriber acquisition.",
    },
    {
      company: "Deezer",
      source_url: "https://example.com/deezer-regional-growth",
      posted_at: "2026-05-21T20:10:00Z",
      is_relevant: true,
      verdict: "Low",
      category: "Geopolitical",
      summary: "Deezer highlighted regional growth in selected European markets.",
      action_item: "Monitor whether Deezer’s regional strategy creates local competitive pressure.",
    },
    {
      company: "Pandora",
      source_url: "https://example.com/pandora-ad-supported-audio",
      posted_at: "2026-05-21T18:45:00Z",
      is_relevant: true,
      verdict: "Low",
      category: "Market Sentiment",
      summary: "Pandora updated ad-supported audio positioning for casual listeners.",
      action_item: "Compare ad-supported retention and monetization strategy against Spotify Free.",
    },
  ],
}

const verdictRank: Record<Verdict, number> = {
  High: 4,
  Medium: 3,
  Low: 2,
  None: 1,
}

function getPostsForProfile(currentProfile?: Profile | null) {
  const profileId = currentProfile?.id ? String(currentProfile.id) : "1"

  return mockPostsByProfile[profileId] ?? mockPostsByProfile["1"]
}

function getVerdictClass(verdict: Verdict) {
  switch (verdict) {
    case "High":
      return "bg-red-50 text-red-600 border-red-200"
    case "Medium":
      return "bg-orange-50 text-orange-600 border-orange-200"
    case "Low":
      return "bg-blue-50 text-blue-600 border-blue-200"
    case "None":
      return "bg-muted text-muted-foreground border-border"
  }
}

function getLeftBarColor(verdict: Verdict) {
  switch (verdict) {
    case "High":
      return "#dc2626"
    case "Medium":
      return "#ea580c"
    case "Low":
      return "#2563eb"
    case "None":
      return "#9ca3af"
  }
}

function getAvatarClass(verdict: Verdict) {
  switch (verdict) {
    case "High":
      return "bg-red-50 text-red-600"
    case "Medium":
      return "bg-orange-50 text-orange-600"
    case "Low":
      return "bg-blue-50 text-blue-600"
    case "None":
      return "bg-muted text-muted-foreground"
  }
}

function formatRelativeTime(postedAt: string) {
  const date = new Date(postedAt)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))

  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function sortPosts(posts: CompetitorNewsPost[]) {
  return [...posts]
    .filter((post) => post.is_relevant)
    .sort((a, b) => {
      const verdictDiff = verdictRank[b.verdict] - verdictRank[a.verdict]

      if (verdictDiff !== 0) {
        return verdictDiff
      }

      return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    })
}

export function CompetitorFeed({
  posts,
  limit,
  currentProfile,
}: CompetitorFeedProps) {
  const profilePosts = posts ?? getPostsForProfile(currentProfile)
  const sortedPosts = sortPosts(profilePosts)
  const visiblePosts =
    typeof limit === "number" ? sortedPosts.slice(0, limit) : sortedPosts

  return (
    <CardContent className="space-y-4 p-0">
      {visiblePosts.map((post, index) => (
        <div
          key={`${post.company}-${post.posted_at}-${index}`}
          className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all group"
          style={{
            borderLeft: "3px solid",
            borderLeftColor: getLeftBarColor(post.verdict),
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0",
                getAvatarClass(post.verdict)
              )}
            >
              {post.company.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-foreground">
                    {post.company}
                  </p>
                  <p className="text-sm text-foreground/90 mt-0.5">
                    {post.summary}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={cn("font-medium", getVerdictClass(post.verdict))}
                >
                  {post.verdict}
                </Badge>
              </div>

              <div className="bg-yellow-100/80 rounded-lg p-3 mb-3">
                <p className="text-sm text-muted-foreground italic">
                  <span className="text-foreground font-medium">AI:</span>{" "}
                  {post.action_item}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>{post.category}</span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(post.posted_at)}
                  </span>
                </div>

                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:underline"
                >
                  Original post
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  )
}