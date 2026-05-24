"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { Logo } from "@/components/sketch/logo"
import { ProfileForm, type ProfileFormSubmitData } from "@/components/sketch/profile-form"
import { ApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { profiles, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const profile = profiles.find((p) => p.id === id)

  if (!profile) {
    return (
      <div className="min-h-screen bg-background paper-texture flex items-center justify-center">
        <div className="sketch-border bg-card p-8 text-center">
          <h1 className="font-sketch text-2xl font-bold text-ink mb-4">Profile not found</h1>
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: ProfileFormSubmitData) => {
    setError("")
    setIsLoading(true)

    try {
      await updateProfile(id, data)
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      <div className="absolute top-10 right-10 text-pencil/20 font-sketch text-6xl -rotate-12 hidden lg:block">~</div>
      <div className="absolute bottom-32 left-16 w-10 h-10 border-2 border-dashed border-pencil/20 rounded-full hidden lg:block" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <Link href="/dashboard">
            <Logo size="large" />
          </Link>
        </div>

        <div className="sketch-border bg-card p-8 relative">
          <div className="tape w-16 h-5 absolute -top-3 left-8 -rotate-3 rounded-sm" />
          <div className="tape w-14 h-5 absolute -top-3 right-10 rotate-2 rounded-sm" />

          <div className="mb-8">
            <h1 className="font-sketch text-3xl md:text-4xl font-bold text-ink">
              Edit Profile
            </h1>
            <p className="mt-2 text-ink/60">
              Update your monitoring settings for {profile.profileName}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-md sketch-border-thin border-destructive/30">
              {error}
            </div>
          )}

          <div className="mb-8 p-4 bg-sticky-green rounded-sm" style={{ transform: "rotate(0.5deg)" }}>
            <p className="font-sketch text-lg text-ink">
              Currently tracking {profile.competitors.length} competitors. Saving updates the
              server profile and regenerates keywords.
            </p>
          </div>

          <ProfileForm
            mode="edit"
            initialData={profile}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Save Changes"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
