"use client"

import { ArrowDown, Zap, Brain, Sparkles, Filter } from "lucide-react"

export function FilteringFunnel() {
  const stages = [
    { value: "1,842", label: "raw updates", width: "100%", color: "bg-ink/20" },
    { value: "642", label: "after deduplication", width: "35%", color: "bg-ink/30" },
    { value: "147", label: "relevant signals", width: "8%", color: "bg-primary/50" },
    { value: "27", label: "sent to AI agents", width: "1.5%", color: "bg-primary/70" },
    { value: "12", label: "actionable insights", width: "0.7%", color: "bg-primary" },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 notebook-lines opacity-20 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            {/* Tape */}
            <div className="tape w-20 h-5 absolute -top-6 left-1/2 -translate-x-1/2 rotate-2 rounded-sm" />
            
            <div className="bg-card sketch-border px-8 py-4">
              <h2 className="font-sketch text-3xl md:text-4xl font-bold text-ink">
                The Filtering Funnel
              </h2>
              <p className="mt-2 text-ink/70">
                Why we exist: <span className="text-primary font-semibold">save time & money</span>
              </p>
            </div>
          </div>
        </div>

        {/* Visual Funnel */}
        <div className="bg-card sketch-border p-6 md:p-8 mb-8">
          <div className="space-y-4">
            {stages.map((stage, i) => (
              <div key={stage.label} className="relative">
                {/* Stage bar */}
                <div className="flex items-center gap-4">
                  <div 
                    className={`h-12 ${stage.color} sketch-border-thin flex items-center justify-center transition-all duration-500`}
                    style={{ width: stage.width, minWidth: '120px' }}
                  >
                    <span className="font-sketch text-xl md:text-2xl font-bold text-ink px-2">
                      {stage.value}
                    </span>
                  </div>
                  <span className="text-sm md:text-base text-ink/70 whitespace-nowrap">
                    {stage.label}
                  </span>
                </div>
                
                {/* Arrow between stages */}
                {i < stages.length - 1 && (
                  <div className="flex justify-start ml-12 my-2">
                    <svg width="30" height="24" viewBox="0 0 30 24" className="text-pencil">
                      <path d="M15 0 L15 16" stroke="currentColor" strokeWidth="2" strokeDasharray="4,3"/>
                      <path d="M8 12 L15 20 L22 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Annotations */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <AnnotationBadge icon={Filter} label="Fast rules" description="~200ms" />
            <AnnotationBadge icon={Zap} label="Classifiers" description="lightweight" />
            <AnnotationBadge icon={Brain} label="AI agents" description="only 27 calls" />
          </div>
        </div>

        {/* Key message */}
        <div className="sticky-note p-6 max-w-2xl mx-auto" style={{ transform: 'rotate(-1deg)' }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <p className="font-sketch text-xl text-ink leading-relaxed">
                {`"AI agents are powerful but slow and expensive. snoop.ai uses a fast filtering layer first, so only the highest-signal updates reach the AI analysis step."`}
              </p>
              <p className="mt-3 text-sm text-ink/60">
                This means <span className="font-bold text-primary">98.5% less AI compute</span>, 
                faster results, and lower costs.
              </p>
            </div>
          </div>
          
          {/* Pin decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-md" />
        </div>

        {/* Stats callout */}
        <div className="mt-12 grid md:grid-cols-3 gap-4 text-center">
          <StatCard value="98.5%" label="noise eliminated" />
          <StatCard value="~200ms" label="filter latency" />
          <StatCard value="$$$" label="AI costs saved" />
        </div>

        {/* Doodle decorations */}
        <div className="absolute top-20 right-0 font-sketch text-4xl text-pencil/20 rotate-12 hidden lg:block">
          !
        </div>
        <svg className="absolute bottom-20 left-0 w-16 h-16 text-pencil/20 hidden lg:block" viewBox="0 0 60 60">
          <path d="M10 50 Q30 10 50 50" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4,4"/>
          <circle cx="30" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
    </section>
  )
}

function AnnotationBadge({ 
  icon: Icon, 
  label, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 sketch-border-thin rounded-full">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-ink">{label}</span>
      <span className="text-xs text-ink/50">({description})</span>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-card sketch-border-thin p-4" style={{ transform: 'rotate(-0.5deg)' }}>
      <div className="font-sketch text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-ink/70">{label}</div>
    </div>
  )
}
