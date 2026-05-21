"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/sketch/logo"
import { ProfileForm } from "@/components/sketch/profile-form"
import { useAuth } from "@/lib/auth-context"

export default function NewProfilePage() {
  const router = useRouter()
  const { addProfile, profiles } = useAuth()

  const handleSubmit = (data: Parameters<typeof addProfile>[0]) => {
    // TODO: Connect to backend API when ready
    addProfile(data)
    router.push("/dashboard")
  }

  const handleCancel = () => {
    // If user has profiles, go to dashboard, otherwise go home
    if (profiles.length > 0) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-pencil/20 font-sketch text-6xl rotate-12 hidden lg:block">*</div>
      <div className="absolute bottom-20 right-20 w-12 h-12 border-2 border-dashed border-pencil/20 rounded-full hidden lg:block" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <Link href="/">
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
              Create a Profile
            </h1>
            <p className="mt-2 text-ink/60">
              Profiles let you separate monitoring for different companies, products, or projects.
            </p>
          </div>

          {/* Helper sticky note */}
          <div className="mb-8 p-4 bg-sticky-yellow rounded-sm" style={{ transform: 'rotate(-0.5deg)' }}>
            <p className="font-sketch text-lg text-ink">
              Tip: Start with your main company and add competitors you want to watch. You can always edit this later!
            </p>
          </div>

          <ProfileForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Create Profile"
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
