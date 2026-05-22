"use client"

import { AppSidebar } from "@/components/sketch/app-sidebar"
import { DashboardHeader } from "@/components/sketch/dashboard-header"
import { SettingsForm } from "@/components/sketch/settings-form"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background paper-texture flex">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <DashboardHeader />
        
        <div className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-sketch text-3xl md:text-4xl font-bold text-ink">Settings</h1>
            <p className="mt-2 text-ink/60">Manage your account preferences</p>
          </div>

          <SettingsForm />
        </div>
      </main>
    </div>
  )
}
