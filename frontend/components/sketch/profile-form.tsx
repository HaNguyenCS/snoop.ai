"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
    competitors: initialData?.competitors?.join("\n") || "",
    keywords: initialData?.keywords?.join(", ") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      profileName: formData.profileName,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName,
      industry: formData.industry,
      productDescription: formData.productDescription,
      competitors: formData.competitors
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean),
      keywords:
        mode === "edit"
          ? formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
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
        <Label htmlFor="competitors" className="font-sketch text-lg">
          Competitors to Track *
        </Label>
        <Textarea
          id="competitors"
          value={formData.competitors}
          onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
          placeholder={"Enter one competitor per line:\nCompetitorA\nCompetitorB"}
          className="sketch-border-thin min-h-[100px]"
          required
        />
        <p className="text-xs text-ink/50">One competitor name per line</p>
      </div>

      {mode === "create" ? (
        <p className="text-xs text-ink/50 p-3 bg-muted/50 rounded-md sketch-border-thin">
          Keywords are generated automatically from your competitors when the profile is created.
        </p>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="keywords" className="font-sketch text-lg">
            Keywords to Monitor
          </Label>
          <Textarea
            id="keywords"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="AI infrastructure, model serving, MLOps"
            className="sketch-border-thin min-h-[80px]"
          />
          <p className="text-xs text-ink/50">
            Edits are saved locally only until profile updates are supported by the API.
          </p>
        </div>
      )}

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
