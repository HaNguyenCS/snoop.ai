"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from "recharts"

const data = [
  { day: "Mon", signals: 18, filtered: 156 },
  { day: "Tue", signals: 24, filtered: 189 },
  { day: "Wed", signals: 31, filtered: 247 },
  { day: "Thu", signals: 28, filtered: 203 },
  { day: "Fri", signals: 35, filtered: 278 },
  { day: "Sat", signals: 12, filtered: 89 },
  { day: "Sun", signals: 8, filtered: 67 },
]

export function SignalChart() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Signal Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 260)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 260)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="filteredGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.25 280)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.55 0.25 280)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="oklch(0.65 0 0)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="oklch(0.65 0 0)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "oklch(0.12 0.005 260)", 
                  border: "1px solid oklch(0.25 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="filtered" 
                stroke="oklch(0.55 0.25 280)" 
                strokeWidth={2}
                fill="url(#filteredGradient)" 
                name="Filtered Updates"
              />
              <Area 
                type="monotone" 
                dataKey="signals" 
                stroke="oklch(0.65 0.2 260)" 
                strokeWidth={2}
                fill="url(#signalGradient)" 
                name="Relevant Signals"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Relevant Signals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Filtered Updates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
