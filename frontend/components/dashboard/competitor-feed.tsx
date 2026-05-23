"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, TrendingUp, Clock } from "lucide-react"

const competitorUpdates = [
  {
    id: 1,
    company: "Acme AI",
    companyInitial: "A",
    companyColor: "bg-primary/20 text-primary",
    title: "Launched a new enterprise pricing tier",
    source: "Pricing Page",
    signalScore: 94,
    impact: "High",
    impactColor: "bg-chart-5/10 text-chart-5 border-chart-5/30",
    aiSummary: "Likely targeting larger B2B customers. Consider reviewing enterprise packaging.",
    time: "2h ago",
  },
  {
    id: 2,
    company: "Northstar Labs",
    companyInitial: "N",
    companyColor: "bg-accent/20 text-accent",
    title: "Posted 8 new ML infrastructure roles",
    source: "Careers Page",
    signalScore: 81,
    impact: "Medium",
    impactColor: "bg-chart-4/10 text-chart-4 border-chart-4/30",
    aiSummary: "Hiring pattern suggests increased investment in model serving infrastructure.",
    time: "4h ago",
  },
  {
    id: 3,
    company: "BrightCart",
    companyInitial: "B",
    companyColor: "bg-chart-3/20 text-chart-3",
    title: "Updated checkout flow documentation",
    source: "Product Docs",
    signalScore: 76,
    impact: "Medium",
    impactColor: "bg-chart-4/10 text-chart-4 border-chart-4/30",
    aiSummary: "May indicate upcoming improvements to conversion optimization features.",
    time: "6h ago",
  },
  {
    id: 4,
    company: "NovaCloud",
    companyInitial: "N",
    companyColor: "bg-chart-4/20 text-chart-4",
    title: "Published a blog post on SOC 2 compliance",
    source: "Blog",
    signalScore: 63,
    impact: "Low",
    impactColor: "bg-chart-3/10 text-chart-3 border-chart-3/30",
    aiSummary: "Relevant to enterprise trust positioning but not urgent.",
    time: "8h ago",
  },
]

function getSignalScoreColor(score: number) {
  if (score >= 90) return "text-chart-5"
  if (score >= 75) return "text-chart-4"
  return "text-chart-3"
}

export function CompetitorFeed() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl">Competitor Feed</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {competitorUpdates.map((update) => (
          <div 
            key={update.id} 
            className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Company avatar */}
              <div className={`w-10 h-10 rounded-lg ${update.companyColor} flex items-center justify-center font-bold flex-shrink-0`}>
                {update.companyInitial}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{update.company}</p>
                    <p className="text-sm text-foreground/90 mt-0.5">{update.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={update.impactColor}>
                      {update.impact}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className={`w-4 h-4 ${getSignalScoreColor(update.signalScore)}`} />
                      <span className={`font-mono font-semibold ${getSignalScoreColor(update.signalScore)}`}>
                        {update.signalScore}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* AI Summary */}
                <div className="bg-primary/5 rounded-lg p-3 mb-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-medium">AI Summary:</span> {update.aiSummary}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {update.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {update.time}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
