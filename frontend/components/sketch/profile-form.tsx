"use client"

import { useCallback, useRef, useState, type KeyboardEvent } from "react"
import { Sparkles, X } from "lucide-react"
import { ApiError, suggestCompetitors } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/mock-data"

export type ProfileFormSubmitData = Omit<
  Profile,
  "id" | "createdAt" | "updatedAt"
>

interface ProfileFormProps {
  initialData?: Partial<Profile>
  onSubmit: (data: ProfileFormSubmitData) => void
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
  mode?: "create" | "edit"
}

function mergeCompetitorLists(existing: string[], suggested: string[]): string[] {
  const next = [...existing]

  for (const name of suggested) {
    const trimmed = name.trim()
    if (!trimmed) continue
    if (next.some((chip) => chip.toLowerCase() === trimmed.toLowerCase())) {
      continue
    }
    next.push(trimmed)
  }

  return next
}

function CompetitorChipInput({
  chips,
  inputValue,
  onChipsChange,
  onInputChange,
  onCommitInput,
  disabled,
}: {
  chips: string[]
  inputValue: string
  onChipsChange: (chips: string[]) => void
  onInputChange: (value: string) => void
  onCommitInput: () => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const removeChip = useCallback(
    (index: number) => {
      onChipsChange(chips.filter((_, i) => i !== index))
    },
    [chips, onChipsChange],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !inputValue && chips.length > 0) {
      event.preventDefault()
      onChipsChange(chips.slice(0, -1))
      return
    }

    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      onCommitInput()
    }
  }

  const handleChange = (value: string) => {
    if (!value.includes(",")) {
      onInputChange(value)
      return
    }

    const parts = value.split(",")
    const tail = parts[parts.length - 1]?.trimStart() ?? ""
    const nextChips = [...chips]

    for (const part of parts.slice(0, -1)) {
      const trimmed = part.trim()
      if (!trimmed) continue
      if (nextChips.some((chip) => chip.toLowerCase() === trimmed.toLowerCase())) {
        continue
      }
      nextChips.push(trimmed)
    }

    onChipsChange(nextChips)
    onInputChange(tail)
  }

  return (
    <div
      role="group"
      aria-label="Competitors to track"
      className={cn(
        "sketch-border-thin flex min-h-[100px] w-full flex-wrap content-start items-start gap-2 rounded-md border bg-transparent px-3 py-2",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        disabled && "pointer-events-none opacity-50",
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {chips.map((competitor, index) => (
        <span
          key={`${competitor}-${index}`}
          className="inline-flex items-center gap-1 rounded-md sketch-border-thin border bg-card px-2 py-1 text-sm text-ink"
        >
          <span className="font-medium">{competitor}</span>
          <button
            type="button"
            aria-label={`Remove ${competitor}`}
            className="rounded-sm p-0.5 text-ink/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={(event) => {
              event.stopPropagation()
              removeChip(index)
            }}
            disabled={disabled}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id="competitors"
        type="text"
        value={inputValue}
        disabled={disabled}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onCommitInput}
        placeholder={chips.length === 0 ? "Type a competitor, then comma or Enter" : "Add another..."}
        className="min-w-[140px] flex-1 self-start border-0 bg-transparent py-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
      />
    </div>
  )
}

export function ProfileForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Profile",
  isLoading = false,
  mode = "create",
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    profileName: initialData?.profileName || "",
    phoneNumber: initialData?.phoneNumber || "",
    companyName: initialData?.companyName || "",
    industry: initialData?.industry || "",
    productDescription: initialData?.productDescription || "",
  })
  const [competitorChips, setCompetitorChips] = useState<string[]>(
    initialData?.competitors?.map((c) => c.trim()).filter(Boolean) ?? [],
  )
  const [competitorInput, setCompetitorInput] = useState("")
  const [isFindingCompetitors, setIsFindingCompetitors] = useState(false)
  const [competitorSuggestError, setCompetitorSuggestError] = useState("")

  const canSuggestCompetitors =
    formData.companyName.trim() &&
    formData.industry.trim() &&
    formData.productDescription.trim()

  const handleFindCompetitors = async () => {
    setCompetitorSuggestError("")

    if (!canSuggestCompetitors) {
      setCompetitorSuggestError(
        "Fill in company, industry, and product description first.",
      )
      return
    }

    setIsFindingCompetitors(true)

    try {
      const suggested = await suggestCompetitors({
        company_name: formData.companyName.trim(),
        industry: formData.industry.trim(),
        product_description: formData.productDescription.trim(),
      })

      if (suggested.length === 0) {
        setCompetitorSuggestError("No competitors were suggested. Try adding your own.")
        return
      }

      setCompetitorChips((prev) => mergeCompetitorLists(prev, suggested))
    } catch (err) {
      if (err instanceof ApiError) {
        setCompetitorSuggestError(err.message)
      } else if (err instanceof Error) {
        setCompetitorSuggestError(err.message)
      } else {
        setCompetitorSuggestError("Could not fetch competitor suggestions.")
      }
    } finally {
      setIsFindingCompetitors(false)
    }
  }

  const commitCompetitorInput = useCallback(() => {
    const trimmed = competitorInput.trim()
    if (!trimmed) {
      setCompetitorInput("")
      return
    }

    setCompetitorChips((prev) => {
      if (prev.some((chip) => chip.toLowerCase() === trimmed.toLowerCase())) {
        return prev
      }
      return [...prev, trimmed]
    })
    setCompetitorInput("")
  }, [competitorInput])

  const buildCompetitorsList = useCallback(() => {
    const pending = competitorInput.trim()
    const list = [...competitorChips]
    if (
      pending &&
      !list.some((chip) => chip.toLowerCase() === pending.toLowerCase())
    ) {
      list.push(pending)
    }
    return list
  }, [competitorChips, competitorInput])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const competitors = buildCompetitorsList()
    if (competitors.length === 0) {
      return
    }

    onSubmit({
      profileName: formData.profileName,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName,
      industry: formData.industry,
      productDescription: formData.productDescription,
      competitors,
      keywords: mode === "edit" ? (initialData?.keywords ?? []) : [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="profileName" className="font-sketch text-lg">
          Profile Name *
        </Label>
        <Input
          id="profileName"
          value={formData.profileName}
          onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
          placeholder="e.g., Acme AI Monitoring"
          className="sketch-border-thin"
          required
        />
        <p className="text-xs text-ink/50">A name to identify this monitoring profile</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="font-sketch text-lg">
          Phone Number *
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          placeholder="e.g., +1 555-123-4567"
          className="sketch-border-thin"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName" className="font-sketch text-lg">
          Company / Organization *
        </Label>
        <Input
          id="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g., Acme AI"
          className="sketch-border-thin"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry" className="font-sketch text-lg">
          Industry *
        </Label>
        <Input
          id="industry"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          placeholder="e.g., AI/ML Infrastructure"
          className="sketch-border-thin"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productDescription" className="font-sketch text-lg">
          Product Description *
        </Label>
        <Textarea
          id="productDescription"
          value={formData.productDescription}
          onChange={(e) =>
            setFormData({ ...formData, productDescription: e.target.value })
          }
          placeholder="What does your company build or sell?"
          className="sketch-border-thin min-h-[100px]"
          required
        />
        <p className="text-xs text-ink/50">
          Used for competitor suggestions and keyword generation
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="competitors" className="font-sketch text-lg">
            Competitors to Track *
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="sketch-border-thin font-sketch shrink-0"
            onClick={handleFindCompetitors}
            disabled={isLoading || isFindingCompetitors || !canSuggestCompetitors}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            {isFindingCompetitors ? "Finding..." : "Find competitors"}
          </Button>
        </div>
        <CompetitorChipInput
          chips={competitorChips}
          inputValue={competitorInput}
          onChipsChange={setCompetitorChips}
          onInputChange={setCompetitorInput}
          onCommitInput={commitCompetitorInput}
          disabled={isLoading || isFindingCompetitors}
        />
        {competitorSuggestError && (
          <p className="text-xs text-destructive">{competitorSuggestError}</p>
        )}
        <p className="text-xs text-ink/50">
          Use Find competitors for AI suggestions, or type names and press comma or Enter.
          You can remove any tag with × or Backspace.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-lg flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="sketch-border-thin font-sketch text-lg"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
