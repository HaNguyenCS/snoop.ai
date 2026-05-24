"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CompetitorFeed } from "@/components/dashboard/competitor-feed"
import {
  DEFAULT_FEED_FILTERS,
  FEED_PRIORITY_LABELS,
  FEED_SORT_LABELS,
  FEED_TIME_RANGE_LABELS,
  filterCompetitorPosts,
  getFeedCompetitorOptions,
  isFeedFiltersActive,
  searchCompetitorPosts,
  sortCompetitorPosts,
  type CompetitorNewsPost,
  type FeedFilters,
  type FeedPriorityFilter,
  type FeedSortOption,
  type FeedTimeRange,
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
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FEED_FILTERS)
  const [searchQuery, setSearchQuery] = useState("")

  const competitorOptions = useMemo(() => getFeedCompetitorOptions(posts), [posts])

  const filteredPosts = useMemo(() => {
    const filtered = filterCompetitorPosts(posts, filters)
    const searched = searchCompetitorPosts(filtered, searchQuery)
    return sortCompetitorPosts(searched, sort)
  }, [posts, filters, searchQuery, sort])

  const filtersActive = isFeedFiltersActive(filters)
  const searchActive = searchQuery.trim().length > 0
  const refinementActive = filtersActive || searchActive

  function updateFilters(patch: Partial<FeedFilters>) {
    setFilters((current) => ({ ...current, ...patch }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FEED_FILTERS)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <FeedHeaderCount
          title={title}
          titleClassName={titleClassName}
          filteredCount={filteredPosts.length}
          totalCount={posts.length}
          filtersActive={refinementActive}
        />

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={filtersActive ? "default" : "outline"}
                size="sm"
                className="sketch-border-thin gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="sketch-border-thin w-56">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filters.priority}
                onValueChange={(value) =>
                  updateFilters({ priority: value as FeedPriorityFilter })
                }
              >
                {(Object.keys(FEED_PRIORITY_LABELS) as FeedPriorityFilter[]).map(
                  (option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {FEED_PRIORITY_LABELS[option]}
                    </DropdownMenuRadioItem>
                  ),
                )}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Time range</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filters.timeRange}
                onValueChange={(value) =>
                  updateFilters({ timeRange: value as FeedTimeRange })
                }
              >
                {(Object.keys(FEED_TIME_RANGE_LABELS) as FeedTimeRange[]).map(
                  (option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {FEED_TIME_RANGE_LABELS[option]}
                    </DropdownMenuRadioItem>
                  ),
                )}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Competitor</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filters.competitor}
                onValueChange={(value) => updateFilters({ competitor: value })}
              >
                <DropdownMenuRadioItem value="all">All competitors</DropdownMenuRadioItem>
                {competitorOptions.map((competitor) => (
                  <DropdownMenuRadioItem key={competitor} value={competitor}>
                    {competitor}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              {filtersActive ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={resetFilters}>
                    Clear filters
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>

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

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search competitor, summary, or action..."
          className="pl-9 sketch-border-thin"
        />
      </div>

      <CompetitorFeed
        posts={filteredPosts}
        loading={loading}
        error={error}
        limit={limit}
        emptyMessage={
          refinementActive && posts.length > 0
            ? "No events match your search or filters."
            : undefined
        }
      />
    </>
  )
}

function FeedHeaderCount({
  title,
  titleClassName,
  filteredCount,
  totalCount,
  filtersActive,
}: {
  title: string
  titleClassName: string
  filteredCount: number
  totalCount: number
  filtersActive: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <h3 className={titleClassName}>{title}</h3>
      <span className="font-sketch text-2xl font-bold text-primary tabular-nums">
        {filtersActive ? `${filteredCount}/${totalCount}` : totalCount}
      </span>
    </div>
  )
}
