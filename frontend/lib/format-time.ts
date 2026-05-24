export function parseApiDate(iso: string | null | undefined): Date | null {
  if (!iso) return null

  const trimmed = iso.trim()
  if (!trimmed) return null

  const hasTimezone = /[zZ]$|[+-]\d{2}:\d{2}$/.test(trimmed)
  const normalized = hasTimezone ? trimmed : `${trimmed}Z`
  const date = new Date(normalized)

  return Number.isNaN(date.getTime()) ? null : date
}

export function formatRelativeTime(iso: string | null | undefined): string {
  const date = parseApiDate(iso)
  if (!date) return "Unknown time"

  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) return "just now"

  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return diffSec <= 5 ? "just now" : `${diffSec}s ago`

  const diffMinutes = Math.floor(diffSec / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  })
}
