"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/mock-data"

interface ProfileFormProps {
  initialData?: Partial<Profile>
  onSubmit: (data: Omit<Profile, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

export function ProfileForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Profile",
  isLoading = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    profileName: initialData?.profileName || "",
    companyName: initialData?.companyName || "",
    industry: initialData?.industry || "",
    website: initialData?.website || "",
    competitors: initialData?.competitors?.join("\n") || "",
    keywords: initialData?.keywords?.join(", ") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // TODO: Add validation before submitting
    // TODO: Connect to backend API when ready
    
    onSubmit({
      profileName: formData.profileName,
      companyName: formData.companyName,
      industry: formData.industry,
      website: formData.website,
      competitors: formData.competitors.split("\n").filter((c) => c.trim()),
      keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile name */}
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

      {/* Company name */}
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

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry" className="font-sketch text-lg">
          Industry
        </Label>
        <Input
          id="industry"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          placeholder="e.g., AI/ML Infrastructure"
          className="sketch-border-thin"
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website" className="font-sketch text-lg">
          Company Website
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://example.com"
          className="sketch-border-thin"
        />
      </div>

      {/* Competitors */}
      <div className="space-y-2">
        <Label htmlFor="competitors" className="font-sketch text-lg">
          Competitors to Track
        </Label>
        <Textarea
          id="competitors"
          value={formData.competitors}
          onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
          placeholder="Enter one competitor per line:&#10;CompetitorA&#10;CompetitorB&#10;CompetitorC"
          className="sketch-border-thin min-h-[100px]"
        />
        <p className="text-xs text-ink/50">One competitor name per line</p>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label htmlFor="keywords" className="font-sketch text-lg">
          Keywords to Monitor
        </Label>
        <Textarea
          id="keywords"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="AI infrastructure, model serving, MLOps, enterprise AI"
          className="sketch-border-thin min-h-[80px]"
        />
        <p className="text-xs text-ink/50">Comma-separated keywords for signal detection</p>
      </div>

      {/* Buttons */}
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
