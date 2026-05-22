"use client"

import { DollarSign, Users, Rocket, FileText, Share2, TrendingUp } from "lucide-react"

export function ProblemSection() {
  const examples = [
    { icon: DollarSign, label: "New pricing page", color: "sticky-note", rotation: -3 },
    { icon: Users, label: "Hiring spike", color: "sticky-note-pink", rotation: 2 },
    { icon: Rocket, label: "Product launch", color: "sticky-note-blue", rotation: -1 },
    { icon: FileText, label: "Blog post", color: "sticky-note-green", rotation: 3 },
    { icon: Share2, label: "Social update", color: "sticky-note", rotation: -2 },
    { icon: TrendingUp, label: "Funding news", color: "sticky-note-pink", rotation: 1 },
  ]

  return (
    <section id="product" className="py-20 px-4 relative">
      {/* Notebook lines background */}
      <div className="absolute inset-0 notebook-lines opacity-30 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        {/* Section header - looks like scribbled note */}
        <div className="text-center mb-16 relative">
          {/* Tape decoration */}
          <div className="tape w-20 h-5 mx-auto -mb-2 rotate-1 rounded-sm" />
          
          <div className="bg-card sketch-border inline-block px-8 py-6 relative">
            <h2 className="font-sketch text-4xl md:text-5xl font-bold text-ink">
              Too many updates.{" "}
              <span className="relative">
                <span className="text-primary">Not enough signal.</span>
                {/* Hand-drawn circle */}
                <svg className="absolute -inset-2 -z-10 text-primary/30" viewBox="0 0 200 60">
                  <ellipse cx="100" cy="30" rx="95" ry="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                </svg>
              </span>
            </h2>
            
            {/* Scribbled arrow pointing down */}
            <svg className="w-12 h-16 mx-auto mt-4 text-pencil" viewBox="0 0 40 60">
              <path d="M20 5 Q22 25 20 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M12 38 L20 50 L28 38" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Explanation text */}
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-ink/80 leading-relaxed text-center">
            Competitors constantly change pricing, launch features, publish blogs, hire teams, and run campaigns. 
            Most of it is <span className="font-sketch text-2xl text-pencil line-through">noise</span>. 
            By the time teams manually notice the important updates, they are already{" "}
            <span className="font-sketch text-2xl text-primary underline-sketch">behind</span>.
          </p>
        </div>

        {/* Floating example cards - sticky notes style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {examples.map((example, i) => (
            <div
              key={example.label}
              className={`${example.color} p-4 rounded-sm shadow-md transition-transform hover:scale-105 cursor-default`}
              style={{ transform: `rotate(${example.rotation}deg)` }}
            >
              <example.icon className="w-6 h-6 text-ink/70 mb-2" />
              <p className="font-sketch text-xl text-ink">{example.label}</p>
              {/* Pin effect */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 shadow-sm hidden md:block" />
            </div>
          ))}
        </div>

        {/* Doodle decorations */}
        <div className="absolute top-10 right-10 font-sketch text-pencil/20 text-3xl rotate-12 hidden lg:block">
          :(
        </div>
        <div className="absolute bottom-20 left-5 w-6 h-6 border-2 border-pencil/20 rotate-45 hidden lg:block" />
      </div>
    </section>
  )
}
