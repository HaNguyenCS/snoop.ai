"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/sketch/logo"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how-it-works" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-ink/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

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
            <Link
              href="/login"
              className="text-ink/70 hover:text-ink font-medium transition-colors"
            >
              Login
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link href="/signup">
              <Button className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-lg px-6">
                Get started
              </Button>
            </Link>
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
              <Link
                href="/login"
                className="text-ink/70 hover:text-ink font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="sketch-border bg-primary text-primary-foreground font-sketch text-lg mt-2 w-full">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
