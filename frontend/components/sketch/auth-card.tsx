"use client"

import { type ReactNode } from "react"
import { Logo } from "@/components/sketch/logo"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-pencil/20 font-sketch text-6xl rotate-12 hidden lg:block">*</div>
      <div className="absolute top-32 right-20 text-pencil/15 font-sketch text-4xl -rotate-6 hidden lg:block">~</div>
      <div className="absolute bottom-20 left-20 w-8 h-8 border-2 border-dashed border-pencil/20 rounded-full hidden lg:block" />
      <div className="absolute bottom-32 right-32 text-pencil/15 font-sketch text-3xl rotate-12 hidden lg:block">?</div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="large" />
        </div>

        {/* Card */}
        <div className="sketch-border bg-card p-8 relative">
          {/* Tape decorations */}
          <div className="tape w-16 h-5 absolute -top-3 left-8 -rotate-3 rounded-sm" />
          <div className="tape w-14 h-5 absolute -top-3 right-10 rotate-2 rounded-sm" />

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-sketch text-3xl font-bold text-ink">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-ink/60">{subtitle}</p>
            )}
          </div>

          {children}

          {/* Tagline */}
          <div className="mt-8 pt-6 border-t border-ink/10 text-center">
            <p className="font-sketch text-ink/50 text-lg">
              Track competitors. Filter noise. Move first.
            </p>
          </div>
        </div>

        {/* Paw prints decoration */}
        <div className="flex justify-center mt-6 opacity-30">
          <PawPrints />
        </div>
      </div>
    </div>
  )
}

function PawPrints() {
  return (
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
  )
}
