"use client"

import { ArrowUpRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  type CompetitorNewsPost,
  type Verdict,
} from "@/lib/events"

export type { CompetitorNewsPost }

interface CompetitorFeedProps {
  posts: CompetitorNewsPost[]
  loading?: boolean
  error?: string | null
  limit?: number
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

function PostCard({ post }: { post: CompetitorNewsPost }) {
  return (
    <div
      className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all group"
      style={{
        borderLeft: "3px solid",
        borderLeftColor: getLeftBarColor(post.verdict),
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0",
            getAvatarClass(post.verdict),
          )}
        >
          {post.company.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-semibold text-foreground">{post.company}</p>
              <p className="text-sm text-foreground/90 mt-0.5">{post.summary}</p>
            </div>
            <Badge
              variant="outline"
              className={cn("font-medium", getVerdictClass(post.verdict))}
            >
              {post.verdict}
            </Badge>
          </div>
          {post.action_item ? (
            <div className="bg-yellow-100/80 rounded-lg p-3 mb-3">
              <p className="text-sm text-muted-foreground italic">
                <span className="text-foreground font-medium">AI:</span>{" "}
                {post.action_item}
              </p>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(post.posted_at)}
            </span>
            {post.source_url !== "#" ? (
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:underline"
              >
                Original post
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompetitorFeed({
  posts,
  loading = false,
  error = null,
  limit,
}: CompetitorFeedProps) {
  const visiblePosts =
    typeof limit === "number" ? posts.slice(0, limit) : posts

  if (loading) {
    return (
      <CardContent className="p-0">
        <p className="text-sm text-muted-foreground">Loading competitor events...</p>
      </CardContent>
    )
  }

  if (error) {
    return (
      <CardContent className="p-0">
        <p className="text-sm text-red-600">{error}</p>
      </CardContent>
    )
  }

  if (visiblePosts.length === 0) {
    return (
      <CardContent className="p-0">
        <p className="text-sm text-muted-foreground">
          No competitor events yet. Events appear here once the scraper finds relevant posts.
        </p>
      </CardContent>
    )
  }

  return (
    <CardContent className="space-y-4 p-0">
      {visiblePosts.map((post, index) => (
        <PostCard key={`${post.company}-${post.posted_at}-${index}`} post={post} />
      ))}
    </CardContent>
  )
}
