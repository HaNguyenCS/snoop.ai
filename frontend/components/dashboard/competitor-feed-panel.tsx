"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CompetitorFeed } from "@/components/dashboard/competitor-feed"
import {
  FEED_SORT_LABELS,
  sortCompetitorPosts,
  type CompetitorNewsPost,
  type FeedSortOption,
} from "@/lib/events"

interface CompetitorFeedPanelProps {
  posts: CompetitorNewsPost[]
  loading?: boolean
  error?: string | null
  limit?: number
  title?: string
  titleClassName?: string
  showLiveBadge?: boolean
}

export function CompetitorFeedPanel({
  posts,
  loading = false,
  error = null,
  limit,
  title = "Competitor Feed",
  titleClassName = "font-sketch text-2xl font-bold text-ink",
  showLiveBadge = false,
}: CompetitorFeedPanelProps) {
  const [sort, setSort] = useState<FeedSortOption>("priority")

  const sortedPosts = useMemo(
    () => sortCompetitorPosts(posts, sort),
    [posts, sort],
  )

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className={titleClassName}>{title}</h3>
          <span className="font-sketch text-2xl font-bold text-primary tabular-nums">
            {posts.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="sketch-border-thin gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort: {FEED_SORT_LABELS[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="sketch-border-thin">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) => setSort(value as FeedSortOption)}
              >
                {(Object.keys(FEED_SORT_LABELS) as FeedSortOption[]).map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {FEED_SORT_LABELS[option]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {showLiveBadge ? (
            <Badge variant="outline" className="sketch-border-thin">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live updates
            </Badge>
          ) : null}
        </div>
      </div>

      <CompetitorFeed
        posts={sortedPosts}
        loading={loading}
        error={error}
        limit={limit}
      />
    </>
  )
}
