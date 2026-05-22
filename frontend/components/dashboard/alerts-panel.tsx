"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "urgent",
    icon: AlertTriangle,
    iconColor: "text-chart-5",
    bgColor: "bg-chart-5/10",
    title: "Acme AI pricing change",
    description: "New enterprise tier detected",
    time: "2h ago",
  },
  {
    id: 2,
    type: "warning",
    icon: Bell,
    iconColor: "text-chart-4",
    bgColor: "bg-chart-4/10",
    title: "Northstar Labs hiring spike",
    description: "8 new ML roles posted",
    time: "4h ago",
  },
  {
    id: 3,
    type: "info",
    icon: Info,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    title: "BrightCart docs updated",
    description: "Checkout flow changes",
    time: "6h ago",
  },
  {
    id: 4,
    type: "resolved",
    icon: CheckCircle,
    iconColor: "text-chart-3",
    bgColor: "bg-chart-3/10",
    title: "NovaCloud blog post",
    description: "SOC 2 compliance article",
    time: "8h ago",
  },
]

export function AlertsPanel() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-chart-4" />
          Alerts
        </CardTitle>
        <Badge variant="secondary" className="bg-chart-5/10 text-chart-5 border-chart-5/30">
          4 Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className={`w-8 h-8 rounded-lg ${alert.bgColor} flex items-center justify-center flex-shrink-0`}>
              <alert.icon className={`w-4 h-4 ${alert.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{alert.title}</p>
              <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full mt-2 text-muted-foreground">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
