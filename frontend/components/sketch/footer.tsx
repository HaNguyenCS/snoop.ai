"use client"

import { Search } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t-2 border-dashed border-ink/20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" className="text-primary">
                <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-ink"/>
                <line x1="20" y1="20" x2="28" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-ink"/>
                <circle cx="14" cy="12" r="2" fill="currentColor"/>
                <circle cx="11" cy="15" r="1.5" fill="currentColor"/>
                <circle cx="17" cy="15" r="1.5" fill="currentColor"/>
                <ellipse cx="14" cy="17.5" rx="2.5" ry="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-sketch text-2xl font-bold text-ink">snoop.ai</span>
          </div>
          
          {/* Tagline */}
          <p className="font-sketch text-xl text-ink/60">
            Signal over noise.
          </p>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-ink/60">
            <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms</a>
            <a href="#" className="hover:text-ink transition-colors">Contact</a>
          </div>
        </div>
        
        {/* Bottom note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-ink/40">
            Made with curiosity and detective spirit
          </p>
          {/* Small paw print */}
          <svg className="w-6 h-6 mx-auto mt-2 text-ink/20" viewBox="0 0 24 24">
            <circle cx="12" cy="14" r="4" fill="currentColor"/>
            <circle cx="7" cy="9" r="2.5" fill="currentColor"/>
            <circle cx="17" cy="9" r="2.5" fill="currentColor"/>
            <circle cx="5" cy="14" r="2" fill="currentColor"/>
            <circle cx="19" cy="14" r="2" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </footer>
  )
}
