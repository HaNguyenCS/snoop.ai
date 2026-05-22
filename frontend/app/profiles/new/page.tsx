"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/sketch/logo"
import { ProfileForm } from "@/components/sketch/profile-form"
import { ApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function NewProfilePage() {
  const router = useRouter()
  const { addProfile, profiles } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (
    data: Parameters<typeof addProfile>[0],
  ) => {
    setError("")
    setIsLoading(true)

    try {
      await addProfile(data)
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to create profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (profiles.length > 0) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      <div className="absolute top-10 left-10 text-pencil/20 font-sketch text-6xl rotate-12 hidden lg:block">*</div>
      <div className="absolute bottom-20 right-20 w-12 h-12 border-2 border-dashed border-pencil/20 rounded-full hidden lg:block" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo size="large" />
          </Link>
        </div>

        <div className="sketch-border bg-card p-8 relative">
          <div className="tape w-16 h-5 absolute -top-3 left-8 -rotate-3 rounded-sm" />
          <div className="tape w-14 h-5 absolute -top-3 right-10 rotate-2 rounded-sm" />

          <div className="mb-8">
            <h1 className="font-sketch text-3xl md:text-4xl font-bold text-ink">
              Create a Profile
            </h1>
            <p className="mt-2 text-ink/60">
              Profiles let you separate monitoring for different companies, products, or projects.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-md sketch-border-thin border-destructive/30">
              {error}
            </div>
          )}

          <div className="mb-8 p-4 bg-sticky-yellow rounded-sm" style={{ transform: "rotate(-0.5deg)" }}>
            <p className="font-sketch text-lg text-ink">
              Tip: Start with your main company and add competitors you want to watch.
            </p>
          </div>

          <ProfileForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Create Profile"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
