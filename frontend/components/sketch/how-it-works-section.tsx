"use client"

import { Radio, Filter, Sparkles, ArrowRight, Eye, Zap, Brain } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      icon: Radio,
      title: "Monitor",
      description: "Scan competitor websites, changelogs, pricing pages, blogs, job boards, ads, and news.",
      color: "bg-sticky-blue",
    },
    {
      number: "2", 
      icon: Filter,
      title: "Filter",
      description: "Use fast rules and lightweight classifiers to remove duplicates, low-signal updates, and irrelevant noise before using AI.",
      color: "bg-sticky-yellow",
    },
    {
      number: "3",
      icon: Sparkles,
      title: "Analyze",
      description: "Send only relevant signals to AI agents for summaries, impact scoring, and recommended actions.",
      color: "bg-sticky-green",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <h2 className="font-sketch text-4xl md:text-5xl font-bold text-ink">
              How it works
            </h2>
            {/* Underline doodle */}
            <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 15">
              <path d="M0 10 Q50 5 100 10 T200 10" stroke="currentColor" strokeWidth="3" fill="none" className="text-primary"/>
            </svg>
          </div>
        </div>

        {/* 3-step cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {/* Card */}
              <div 
                className={`${step.color} sketch-border p-6 h-full relative`}
                style={{ transform: `rotate(${(i - 1) * 1.5}deg)` }}
              >
                {/* Step number - circled */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-card sketch-border rounded-full flex items-center justify-center">
                  <span className="font-sketch text-2xl font-bold text-ink">{step.number}</span>
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-4 mt-2">
                  <div className="w-16 h-16 rounded-full bg-card/50 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-ink" />
                  </div>
                </div>
                
                <h3 className="font-sketch text-3xl font-bold text-ink text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-ink/70 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Arrow between cards (hidden on mobile) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 z-10">
                  <svg width="40" height="30" viewBox="0 0 40 30" className="text-ink">
                    <path d="M5 15 Q15 15 25 15" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4,4"/>
                    <path d="M22 8 L30 15 L22 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pipeline visualization */}
        <div className="bg-card sketch-border p-8 relative">
          {/* Tape decoration */}
          <div className="tape w-16 h-5 absolute -top-3 left-8 -rotate-3 rounded-sm" />
          <div className="tape w-14 h-5 absolute -top-3 right-12 rotate-2 rounded-sm" />
          
          <h3 className="font-sketch text-2xl font-bold text-ink text-center mb-8">
            The Signal Pipeline
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            <PipelineStep icon={Eye} label="Raw updates" value="1,284" />
            <PipelineArrow />
            <PipelineStep icon={Filter} label="Fast filter" value="~200ms" isHighlight />
            <PipelineArrow />
            <PipelineStep icon={Zap} label="High-signal" value="147" />
            <PipelineArrow />
            <PipelineStep icon={Brain} label="AI insights" value="27" />
            <PipelineArrow />
            <PipelineStep icon={Sparkles} label="Dashboard" value="12 actions" isAccent />
          </div>
          
          {/* Hand-drawn annotation */}
          <div className="mt-8 text-center">
            <p className="font-sketch text-xl text-pencil">
              {`"Most AI never sees the noise"`}
              <span className="text-primary ml-2">*</span>
            </p>
          </div>
        </div>

        {/* Floating doodles */}
        <svg className="absolute top-20 right-10 w-12 h-12 text-pencil/20 hidden lg:block" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3"/>
          <circle cx="20" cy="20" r="5" fill="currentColor"/>
        </svg>
      </div>
    </section>
  )
}

function PipelineStep({ 
  icon: Icon, 
  label, 
  value, 
  isHighlight = false,
  isAccent = false 
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  isHighlight?: boolean
  isAccent?: boolean
}) {
  return (
    <div className={`
      flex flex-col items-center p-3 rounded-lg min-w-[80px]
      ${isHighlight ? 'bg-primary/10 sketch-border-thin border-primary' : ''}
      ${isAccent ? 'bg-sticky-green' : ''}
    `}>
      <Icon className={`w-6 h-6 mb-1 ${isHighlight ? 'text-primary' : 'text-ink/70'}`} />
      <span className="font-sketch text-sm text-ink/60">{label}</span>
      <span className={`font-sketch text-lg font-bold ${isHighlight ? 'text-primary' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  )
}

function PipelineArrow() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" className="text-pencil shrink-0">
      <path d="M0 10 L20 10" stroke="currentColor" strokeWidth="2" strokeDasharray="4,3"/>
      <path d="M16 5 L24 10 L16 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}
