"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Demo", href: "#demo" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-ink/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
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
            <span className="font-sketch text-2xl font-bold text-ink">snoop.ai</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="text-ink/70 hover:text-ink font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Button className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-lg px-6">
              Get early access
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-ink/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="text-ink/70 hover:text-ink font-medium px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button className="sketch-border bg-primary text-primary-foreground font-sketch text-lg mt-2">
                Get early access
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
