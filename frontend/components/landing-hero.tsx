"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Radio, Filter, Brain, Target } from "lucide-react"

interface LandingHeroProps {
  onViewDashboard: () => void
}

export function LandingHero({ onViewDashboard }: LandingHeroProps) {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold">snoop.ai</span>
        </div>
        <Button variant="outline" size="sm" onClick={onViewDashboard}>
          Sign In
        </Button>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="secondary" className="px-3 py-1.5 bg-secondary/50 border border-border">
            <Radio className="w-3 h-3 mr-1.5 text-primary animate-pulse" />
            Near real-time monitoring
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 bg-secondary/50 border border-border">
            <Filter className="w-3 h-3 mr-1.5 text-primary" />
            Noise filtering
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 bg-secondary/50 border border-border">
            <Brain className="w-3 h-3 mr-1.5 text-primary" />
            AI-powered insights
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 bg-secondary/50 border border-border">
            <Target className="w-3 h-3 mr-1.5 text-primary" />
            Competitor intelligence
          </Badge>
        </div>

        {/* Main title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
          Track competitors.{" "}
          <span className="text-gradient">Filter noise.</span>{" "}
          Move first.
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
          snoop.ai monitors competitor updates in near real time, filters irrelevant data before it reaches AI agents, and surfaces only the market signals that matter.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg glow hover:glow-sm transition-all"
            onClick={onViewDashboard}
          >
            View Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={scrollToHowItWorks}
          >
            See How It Works
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
