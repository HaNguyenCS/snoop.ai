"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Zap, Radio } from "lucide-react"

interface HeroSectionProps {
  onViewDashboard?: () => void
  onHowItWorks?: () => void
}

export function HeroSection({ onViewDashboard, onHowItWorks }: HeroSectionProps) {
  const badges = [
    { icon: Radio, label: "24/7 monitoring" },
    { icon: Filter, label: "Noise filtering" },
    { icon: Zap, label: "AI-powered insights" },
    { icon: Search, label: "Signal > noise" },
  ]

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Decorative doodles */}
      <div className="absolute top-10 left-10 text-pencil/30 font-sketch text-6xl rotate-12 hidden lg:block">*</div>
      <div className="absolute top-32 right-20 text-pencil/20 font-sketch text-4xl -rotate-6 hidden lg:block">~</div>
      <div className="absolute bottom-20 left-20 w-8 h-8 border-2 border-dashed border-pencil/30 rounded-full hidden lg:block" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="relative z-10">
            {/* Small tape decoration */}
            <div className="tape w-16 h-6 -rotate-6 absolute -top-8 left-4 rounded-sm" />
            
            <h1 className="font-sketch text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-tight">
              Track competitors.{" "}
              <span className="relative inline-block">
                <span className="underline-sketch">Filter noise.</span>
              </span>{" "}
              <span className="text-primary">Move first.</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-ink/70 leading-relaxed max-w-xl">
              snoop.ai watches competitor websites, pricing pages, blogs, job boards, changelogs, and social updates, 
              then filters the noise before AI agents analyze what matters.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              {onViewDashboard ? (
                <Button 
                  onClick={onViewDashboard}
                  className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-xl px-8 py-6 wiggle-hover"
                >
                  View dashboard
                </Button>
              ) : (
                <Link href="/signup">
                  <Button 
                    className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-xl px-8 py-6 wiggle-hover"
                  >
                    Get started
                  </Button>
                </Link>
              )}
              {onHowItWorks ? (
                <Button 
                  onClick={onHowItWorks}
                  variant="outline"
                  className="sketch-border-thin border-ink text-ink hover:bg-ink/5 font-sketch text-xl px-8 py-6"
                >
                  See how it works
                </Button>
              ) : (
                <a href="#how-it-works">
                  <Button 
                    variant="outline"
                    className="sketch-border-thin border-ink text-ink hover:bg-ink/5 font-sketch text-xl px-8 py-6"
                  >
                    See how it works
                  </Button>
                </a>
              )}
            </div>

            {/* Badges */}
            <div className="mt-10 flex flex-wrap gap-3">
              {badges.map((badge, i) => (
                <div 
                  key={badge.label}
                  className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full sketch-border-thin"
                  style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (i + 1)}deg)` }}
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-ink/80">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <DetectiveMascot />
          </div>
        </div>
      </div>
    </section>
  )
}

function DetectiveMascot() {
  return (
    <div className="relative">
      {/* Speech bubble */}
      <div className="absolute -top-8 -left-4 bg-card sketch-border px-4 py-2 max-w-[180px] z-10">
        <p className="font-sketch text-lg text-ink">{`"I found something interesting..."`}</p>
        {/* Bubble tail */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-card border-r-2 border-b-2 border-ink transform rotate-45" />
      </div>

      {/* Main mascot container */}
      <div className="relative w-72 h-80 md:w-80 md:h-96">
        <svg viewBox="0 0 300 360" className="w-full h-full">
          {/* Body - Fox shape */}
          <ellipse cx="150" cy="260" rx="70" ry="80" fill="#F5E6D3" stroke="#2D2A26" strokeWidth="2.5"/>
          
          {/* Trench coat */}
          <path d="M80 220 Q80 300 100 340 L200 340 Q220 300 220 220 Q200 240 150 240 Q100 240 80 220" 
                fill="#C4A574" stroke="#2D2A26" strokeWidth="2"/>
          {/* Coat collar */}
          <path d="M100 220 Q120 200 150 210 Q180 200 200 220 Q180 230 150 225 Q120 230 100 220" 
                fill="#A08060" stroke="#2D2A26" strokeWidth="2"/>
          {/* Coat buttons */}
          <circle cx="150" cy="260" r="5" fill="#2D2A26"/>
          <circle cx="150" cy="285" r="5" fill="#2D2A26"/>
          <circle cx="150" cy="310" r="5" fill="#2D2A26"/>
          
          {/* Head */}
          <ellipse cx="150" cy="130" rx="60" ry="55" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2.5"/>
          
          {/* Inner face - lighter */}
          <ellipse cx="150" cy="145" rx="40" ry="35" fill="#F5D4A8"/>
          
          {/* Ears */}
          <path d="M95 90 L85 40 L115 70 Z" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2"/>
          <path d="M100 80 L95 55 L112 72 Z" fill="#F5D4A8"/>
          <path d="M205 90 L215 40 L185 70 Z" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2"/>
          <path d="M200 80 L205 55 L188 72 Z" fill="#F5D4A8"/>
          
          {/* Deerstalker hat */}
          <ellipse cx="150" cy="85" rx="55" ry="15" fill="#8B6F4E" stroke="#2D2A26" strokeWidth="2"/>
          <path d="M100 85 Q100 50 150 45 Q200 50 200 85" fill="#A0845C" stroke="#2D2A26" strokeWidth="2"/>
          {/* Hat flaps */}
          <ellipse cx="95" cy="90" rx="20" ry="12" fill="#8B6F4E" stroke="#2D2A26" strokeWidth="2"/>
          <ellipse cx="205" cy="90" rx="20" ry="12" fill="#8B6F4E" stroke="#2D2A26" strokeWidth="2"/>
          {/* Hat band */}
          <rect x="100" y="78" width="100" height="8" fill="#5C4830"/>
          
          {/* Eyes */}
          <ellipse cx="125" cy="125" rx="12" ry="14" fill="white" stroke="#2D2A26" strokeWidth="2"/>
          <ellipse cx="175" cy="125" rx="12" ry="14" fill="white" stroke="#2D2A26" strokeWidth="2"/>
          {/* Pupils - looking to the side */}
          <circle cx="128" cy="127" r="6" fill="#2D2A26"/>
          <circle cx="178" cy="127" r="6" fill="#2D2A26"/>
          {/* Eye shine */}
          <circle cx="130" cy="124" r="2" fill="white"/>
          <circle cx="180" cy="124" r="2" fill="white"/>
          
          {/* Eyebrows - curious expression */}
          <path d="M113 108 Q125 105 137 110" stroke="#2D2A26" strokeWidth="2.5" fill="none"/>
          <path d="M163 110 Q175 105 187 108" stroke="#2D2A26" strokeWidth="2.5" fill="none"/>
          
          {/* Nose */}
          <ellipse cx="150" cy="152" rx="10" ry="7" fill="#2D2A26"/>
          
          {/* Snout */}
          <path d="M135 155 Q150 170 165 155" stroke="#2D2A26" strokeWidth="2" fill="none"/>
          
          {/* Whiskers */}
          <line x1="115" y1="150" x2="85" y2="145" stroke="#2D2A26" strokeWidth="1.5"/>
          <line x1="115" y1="155" x2="85" y2="158" stroke="#2D2A26" strokeWidth="1.5"/>
          <line x1="185" y1="150" x2="215" y2="145" stroke="#2D2A26" strokeWidth="1.5"/>
          <line x1="185" y1="155" x2="215" y2="158" stroke="#2D2A26" strokeWidth="1.5"/>
          
          {/* Arm holding magnifying glass */}
          <ellipse cx="230" cy="220" rx="15" ry="20" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2"/>
          
          {/* Magnifying glass */}
          <circle cx="260" cy="170" r="35" fill="none" stroke="#2D2A26" strokeWidth="4"/>
          <circle cx="260" cy="170" r="30" fill="#E8F4FF" fillOpacity="0.5"/>
          <line x1="235" y1="195" x2="215" y2="220" stroke="#2D2A26" strokeWidth="6" strokeLinecap="round"/>
          {/* Glass shine */}
          <path d="M245 155 Q255 150 265 155" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
          
          {/* Paw/Hand on magnifying glass */}
          <ellipse cx="218" cy="218" rx="12" ry="10" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2"/>
          
          {/* Tail peeking out */}
          <path d="M220 320 Q250 300 260 330 Q265 350 250 345" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2"/>
          <path d="M250 340 Q255 345 250 345" fill="#F5D4A8" stroke="none"/>
        </svg>
        
        {/* Floating doodles around mascot */}
        <div className="absolute -right-8 top-20 text-primary font-sketch text-2xl animate-pulse">!</div>
        <div className="absolute -left-4 bottom-32 text-pencil/40 font-sketch text-xl">?</div>
        
        {/* Paw prints trail */}
        <svg className="absolute -bottom-4 -left-8 w-32 h-16 text-pencil/30" viewBox="0 0 100 50">
          <g transform="translate(10, 25) rotate(-20)">
            <circle cx="0" cy="0" r="3" fill="currentColor"/>
            <circle cx="-4" cy="-5" r="2" fill="currentColor"/>
            <circle cx="4" cy="-5" r="2" fill="currentColor"/>
            <circle cx="-6" cy="-1" r="2" fill="currentColor"/>
            <circle cx="6" cy="-1" r="2" fill="currentColor"/>
          </g>
          <g transform="translate(35, 15) rotate(-30)">
            <circle cx="0" cy="0" r="3" fill="currentColor"/>
            <circle cx="-4" cy="-5" r="2" fill="currentColor"/>
            <circle cx="4" cy="-5" r="2" fill="currentColor"/>
            <circle cx="-6" cy="-1" r="2" fill="currentColor"/>
            <circle cx="6" cy="-1" r="2" fill="currentColor"/>
          </g>
          <g transform="translate(60, 30) rotate(-15)">
            <circle cx="0" cy="0" r="3" fill="currentColor"/>
            <circle cx="-4" cy="-5" r="2" fill="currentColor"/>
            <circle cx="4" cy="-5" r="2" fill="currentColor"/>
            <circle cx="-6" cy="-1" r="2" fill="currentColor"/>
            <circle cx="6" cy="-1" r="2" fill="currentColor"/>
          </g>
        </svg>
      </div>
    </div>
  )
}
