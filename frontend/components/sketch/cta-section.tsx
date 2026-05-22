"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"

export function CtaSection() {
  return (
    <section id="demo" className="py-20 px-4 relative">
      <div className="max-w-3xl mx-auto relative">
        {/* Main CTA card - sticky note style */}
        <div 
          className="sticky-note p-8 md:p-12 text-center relative"
          style={{ transform: 'rotate(-1deg)' }}
        >
          {/* Multiple tape strips */}
          <div className="tape w-20 h-6 absolute -top-3 left-8 -rotate-6 rounded-sm" />
          <div className="tape w-16 h-6 absolute -top-3 right-12 rotate-3 rounded-sm" />
          
          {/* Pin */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-400 shadow-lg z-10" />
          
          {/* Small mascot doodle */}
          <div className="absolute -top-8 -right-4 md:-right-12 w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Simple fox head */}
              <ellipse cx="40" cy="45" rx="25" ry="22" fill="#E8A45C" stroke="#2D2A26" strokeWidth="2"/>
              <ellipse cx="40" cy="50" rx="15" ry="12" fill="#F5D4A8"/>
              {/* Ears */}
              <path d="M20 35 L15 15 L30 28 Z" fill="#E8A45C" stroke="#2D2A26" strokeWidth="1.5"/>
              <path d="M60 35 L65 15 L50 28 Z" fill="#E8A45C" stroke="#2D2A26" strokeWidth="1.5"/>
              {/* Eyes */}
              <circle cx="32" cy="42" r="4" fill="white" stroke="#2D2A26" strokeWidth="1.5"/>
              <circle cx="48" cy="42" r="4" fill="white" stroke="#2D2A26" strokeWidth="1.5"/>
              <circle cx="33" cy="43" r="2" fill="#2D2A26"/>
              <circle cx="49" cy="43" r="2" fill="#2D2A26"/>
              {/* Nose */}
              <ellipse cx="40" cy="52" rx="4" ry="3" fill="#2D2A26"/>
              {/* Wink/smile */}
              <path d="M35 56 Q40 60 45 56" stroke="#2D2A26" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          
          <h2 className="font-sketch text-4xl md:text-5xl font-bold text-ink mb-4">
            Move first while competitors catch up.
          </h2>
          
          <p className="text-lg text-ink/70 mb-8 max-w-xl mx-auto">
            Join the early access list and be the first to know when snoop.ai launches. 
            Get competitive intelligence that actually matters.
          </p>
          
          <Link href="/signup">
            <Button 
              size="lg"
              className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-2xl px-10 py-7 wiggle-hover"
            >
              <Search className="w-5 h-5 mr-2" />
              Start snooping
            </Button>
          </Link>
          
          {/* Hand-drawn arrow pointing to button */}
          <svg className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-12 text-pencil" viewBox="0 0 60 45">
            <path d="M30 0 Q32 20 30 35" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4,3"/>
            <path d="M22 28 L30 40 L38 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Floating doodles */}
        <div className="absolute -top-4 -left-8 font-sketch text-5xl text-pencil/20 rotate-12 hidden md:block">
          *
        </div>
        <div className="absolute -bottom-4 -right-8 font-sketch text-4xl text-pencil/20 -rotate-6 hidden md:block">
          ~
        </div>
        
        {/* Paw prints */}
        <svg className="absolute bottom-0 left-0 w-24 h-12 text-pencil/20 hidden lg:block" viewBox="0 0 80 40">
          <g transform="translate(15, 25) rotate(-25) scale(0.8)">
            <circle cx="0" cy="0" r="4" fill="currentColor"/>
            <circle cx="-5" cy="-7" r="2.5" fill="currentColor"/>
            <circle cx="5" cy="-7" r="2.5" fill="currentColor"/>
            <circle cx="-8" cy="-2" r="2.5" fill="currentColor"/>
            <circle cx="8" cy="-2" r="2.5" fill="currentColor"/>
          </g>
          <g transform="translate(50, 15) rotate(-10) scale(0.8)">
            <circle cx="0" cy="0" r="4" fill="currentColor"/>
            <circle cx="-5" cy="-7" r="2.5" fill="currentColor"/>
            <circle cx="5" cy="-7" r="2.5" fill="currentColor"/>
            <circle cx="-8" cy="-2" r="2.5" fill="currentColor"/>
            <circle cx="8" cy="-2" r="2.5" fill="currentColor"/>
          </g>
        </svg>
      </div>
    </section>
  )
}
