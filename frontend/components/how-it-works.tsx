"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Radar, Filter, Brain, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Radar,
      title: "Monitor",
      description: "Continuously scan competitor websites, changelogs, blogs, pricing pages, job posts, press releases, and social channels.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Filter,
      title: "Filter",
      description: "Use fast rules and lightweight classifiers to remove irrelevant updates before triggering expensive AI analysis.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Brain,
      title: "Analyze",
      description: "Send only high-signal updates to AI agents for summarization, impact scoring, and recommended actions.",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <section id="how-it-works" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A three-step pipeline that delivers actionable intelligence, not noise.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary via-accent to-chart-3 -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <Card 
              key={step.title} 
              className="relative bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className="p-8 text-center">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background border border-border rounded-full text-sm font-mono text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${step.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
              
              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center py-4">
                  <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Filtering visualization */}
        <div className="mt-20">
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl font-semibold text-center mb-8">Signal Filtering Pipeline</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                {/* Stage 1 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-muted-foreground">1,284</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Raw Updates</span>
                </div>
                
                <ArrowRight className="w-8 h-8 text-muted-foreground/50 rotate-90 md:rotate-0 flex-shrink-0" />
                
                {/* Stage 2 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-primary">247</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Passed Basic Filter</span>
                </div>
                
                <ArrowRight className="w-8 h-8 text-muted-foreground/50 rotate-90 md:rotate-0 flex-shrink-0" />
                
                {/* Stage 3 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-accent">31</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Sent to AI Agents</span>
                </div>
                
                <ArrowRight className="w-8 h-8 text-muted-foreground/50 rotate-90 md:rotate-0 flex-shrink-0" />
                
                {/* Stage 4 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-20 h-20 rounded-full bg-chart-3/20 flex items-center justify-center mb-3 glow-sm">
                    <span className="text-2xl font-bold text-chart-3">12</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Actionable Insights</span>
                </div>
              </div>
              
              {/* Efficiency stat */}
              <div className="mt-8 pt-8 border-t border-border/50 text-center">
                <p className="text-lg text-muted-foreground">
                  <span className="text-3xl font-bold text-primary">99%</span> of noise filtered before reaching AI agents
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
