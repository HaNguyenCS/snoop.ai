"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EventsRefreshButtonProps {
  onRefresh: () => void
  refreshing?: boolean
  disabled?: boolean
  className?: string
}

export function EventsRefreshButton({
  onRefresh,
  refreshing = false,
  disabled = false,
  className,
}: EventsRefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("sketch-border-thin gap-2", className)}
      onClick={onRefresh}
      disabled={disabled || refreshing}
    >
      <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
      Refresh
    </Button>
  )
}
