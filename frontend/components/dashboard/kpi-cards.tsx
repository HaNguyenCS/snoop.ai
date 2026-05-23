"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Radio, Filter, Zap, AlertTriangle } from "lucide-react"

const kpis = [
  {
    label: "Updates Scanned Today",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: Radio,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Relevant Signals",
    value: "31",
    change: "+8%",
    trend: "up",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    label: "Noise Filtered",
    value: "87%",
    change: "+3%",
    trend: "up",
    icon: Filter,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    label: "Urgent Competitor Moves",
    value: "4",
    change: "-2",
    trend: "down",
    icon: AlertTriangle,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

export function KpiCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${kpi.trend === "up" ? "text-chart-3" : "text-chart-5"}`}>
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {kpi.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{kpi.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
