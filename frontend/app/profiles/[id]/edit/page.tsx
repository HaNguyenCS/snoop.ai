"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/sketch/logo"
import { ProfileForm } from "@/components/sketch/profile-form"
import { useAuth } from "@/lib/auth-context"
import { use } from "react"

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { profiles, updateProfile } = useAuth()
  
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

  const handleSubmit = (data: Parameters<typeof updateProfile>[1]) => {
    // TODO: Connect to backend API when ready
    updateProfile(id, data)
    router.push("/dashboard")
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-pencil/20 font-sketch text-6xl -rotate-12 hidden lg:block">~</div>
      <div className="absolute bottom-32 left-16 w-10 h-10 border-2 border-dashed border-pencil/20 rounded-full hidden lg:block" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <Link href="/dashboard">
            <Logo size="large" />
          </Link>
        </div>

        {/* Main card */}
        <div className="sketch-border bg-card p-8 relative">
          {/* Tape decorations */}
          <div className="tape w-16 h-5 absolute -top-3 left-8 -rotate-3 rounded-sm" />
          <div className="tape w-14 h-5 absolute -top-3 right-10 rotate-2 rounded-sm" />

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-sketch text-3xl md:text-4xl font-bold text-ink">
              Edit Profile
            </h1>
            <p className="mt-2 text-ink/60">
              Update your monitoring settings for {profile.profileName}
            </p>
          </div>

          {/* Current stats note */}
          <div className="mb-8 p-4 bg-sticky-green rounded-sm" style={{ transform: 'rotate(0.5deg)' }}>
            <p className="font-sketch text-lg text-ink">
              Currently tracking {profile.competitors.length} competitors with {profile.keywords.length} keywords
            </p>
          </div>

          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Save Changes"
          />
        </div>

        {/* Paw prints decoration */}
        <div className="flex justify-center mt-8 opacity-30">
          <svg className="w-24 h-8 text-pencil" viewBox="0 0 100 30">
            <g transform="translate(15, 15) rotate(-15)">
              <circle cx="0" cy="0" r="3" fill="currentColor"/>
              <circle cx="-4" cy="-5" r="2" fill="currentColor"/>
              <circle cx="4" cy="-5" r="2" fill="currentColor"/>
              <circle cx="-6" cy="-1" r="2" fill="currentColor"/>
              <circle cx="6" cy="-1" r="2" fill="currentColor"/>
            </g>
            <g transform="translate(50, 12) rotate(-5)">
              <circle cx="0" cy="0" r="3" fill="currentColor"/>
              <circle cx="-4" cy="-5" r="2" fill="currentColor"/>
              <circle cx="4" cy="-5" r="2" fill="currentColor"/>
              <circle cx="-6" cy="-1" r="2" fill="currentColor"/>
              <circle cx="6" cy="-1" r="2" fill="currentColor"/>
            </g>
            <g transform="translate(85, 15) rotate(10)">
              <circle cx="0" cy="0" r="3" fill="currentColor"/>
              <circle cx="-4" cy="-5" r="2" fill="currentColor"/>
              <circle cx="4" cy="-5" r="2" fill="currentColor"/>
              <circle cx="-6" cy="-1" r="2" fill="currentColor"/>
              <circle cx="6" cy="-1" r="2" fill="currentColor"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
