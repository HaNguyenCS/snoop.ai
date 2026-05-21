"use client"

import { Search } from "lucide-react"

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizes = {
    small: { icon: 24, text: "text-xl" },
    default: { icon: 32, text: "text-2xl" },
    large: { icon: 40, text: "text-3xl" },
  }

  const { icon, text } = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg width={icon} height={icon} viewBox="0 0 32 32" className="text-primary">
          {/* Magnifying glass with paw */}
          <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-ink"/>
          <line x1="20" y1="20" x2="28" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-ink"/>
          {/* Paw print inside */}
          <circle cx="14" cy="12" r="2" fill="currentColor"/>
          <circle cx="11" cy="15" r="1.5" fill="currentColor"/>
          <circle cx="17" cy="15" r="1.5" fill="currentColor"/>
          <ellipse cx="14" cy="17.5" rx="2.5" ry="1.5" fill="currentColor"/>
        </svg>
      </div>
      <span className={`font-sketch ${text} font-bold text-ink`}>snoop.ai</span>
    </div>
  )
}
