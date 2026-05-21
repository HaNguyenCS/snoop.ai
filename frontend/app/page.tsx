"use client"

import { useState, useRef } from "react"
import { Navbar } from "@/components/sketch/navbar"
import { HeroSection } from "@/components/sketch/hero-section"
import { ProblemSection } from "@/components/sketch/problem-section"
import { HowItWorksSection } from "@/components/sketch/how-it-works-section"
import { DashboardPreview } from "@/components/sketch/dashboard-preview"
import { FilteringFunnel } from "@/components/sketch/filtering-funnel"
import { CtaSection } from "@/components/sketch/cta-section"
import { Footer } from "@/components/sketch/footer"

export default function Home() {
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-background paper-texture">
      <Navbar />
      <HeroSection 
        onViewDashboard={() => scrollToSection(dashboardRef)}
        onHowItWorks={() => scrollToSection(howItWorksRef)}
      />
      <ProblemSection />
      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>
      <div ref={dashboardRef}>
        <DashboardPreview />
      </div>
      <FilteringFunnel />
      <CtaSection />
      <Footer />
    </main>
  )
}
