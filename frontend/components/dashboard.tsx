"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { CompetitorFeed } from "@/components/dashboard/competitor-feed"
import { SignalChart } from "@/components/dashboard/signal-chart"
import { AiInsights } from "@/components/dashboard/ai-insights"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"

interface DashboardProps {
  onBack: () => void
}

export function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onBack={onBack}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* KPI Cards */}
            <KpiCards />
            
            {/* Main grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Competitor feed - takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <CompetitorFeed />
                <SignalChart />
              </div>
              
              {/* Right sidebar */}
              <div className="space-y-6">
                <AiInsights />
                <AlertsPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
