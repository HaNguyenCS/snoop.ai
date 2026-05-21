"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, ExternalLink, Lightbulb } from "lucide-react"

const insights = [
  {
    id: 1,
    title: "Competitor moving upmarket",
    summary: "Acme AI's new enterprise tier and recent security-focused blog posts suggest a push toward larger customers.",
    action: "Review enterprise pricing, compliance messaging, and sales enablement materials.",
    confidence: 91,
    signalScore: 94,
    impact: "High",
    impactColor: "bg-chart-5/10 text-chart-5 border-chart-5/30",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Infrastructure investment detected",
    summary: "Northstar Labs hiring spree indicates major infrastructure scaling, potentially preparing for product launch.",
    action: "Monitor for product announcements. Consider accelerating roadmap items.",
    confidence: 78,
    signalScore: 81,
    impact: "Medium",
    impactColor: "bg-chart-4/10 text-chart-4 border-chart-4/30",
    time: "4h ago",
  },
]

export function AiInsights() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Insights
        </CardTitle>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
          {insights.length} New
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm">{insight.title}</h4>
              <Badge variant="outline" className={insight.impactColor}>
                {insight.impact}
              </Badge>
            </div>
            
            {/* Summary */}
            <p className="text-sm text-muted-foreground">{insight.summary}</p>
            
            {/* Recommended action */}
            <div className="bg-primary/5 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">Action:</span> {insight.action}
                </p>
              </div>
            </div>
            
            {/* Confidence bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono font-semibold text-primary">{insight.confidence}%</span>
              </div>
              <Progress value={insight.confidence} className="h-1.5" />
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{insight.time}</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
