"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { AlertTriangle } from "lucide-react"

export function SettingsForm() {
  const { user, profiles, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    emailNotifications: user?.notificationPreferences.email ?? true,
    pushNotifications: user?.notificationPreferences.push ?? true,
    weeklyDigest: user?.notificationPreferences.weekly ?? false,
    theme: user?.theme || "light",
    defaultProfileId: user?.defaultProfileId || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    // TODO: Connect to backend API when ready
    // await fetch('/api/user/settings', {
    //   method: 'PUT',
    //   body: JSON.stringify(formData),
    // })
    
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    updateUser({
      name: formData.name,
      email: formData.email,
      notificationPreferences: {
        email: formData.emailNotifications,
        push: formData.pushNotifications,
        weekly: formData.weeklyDigest,
      },
      theme: formData.theme as "light" | "dark" | "system",
      defaultProfileId: formData.defaultProfileId || null,
    })
    
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Profile section */}
      <section className="sketch-border bg-card p-6">
        <h2 className="font-sketch text-2xl font-bold text-ink mb-6">Profile</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-sketch text-lg">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="sketch-border-thin max-w-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sketch text-lg">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="sketch-border-thin max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Notifications section */}
      <section className="sketch-border bg-card p-6">
        <h2 className="font-sketch text-2xl font-bold text-ink mb-6">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between max-w-md">
            <div>
              <Label className="font-sketch text-lg">Email notifications</Label>
              <p className="text-sm text-ink/50">Receive alerts via email</p>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between max-w-md">
            <div>
              <Label className="font-sketch text-lg">Push notifications</Label>
              <p className="text-sm text-ink/50">Browser push notifications</p>
            </div>
            <Switch
              checked={formData.pushNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, pushNotifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between max-w-md">
            <div>
              <Label className="font-sketch text-lg">Weekly digest</Label>
              <p className="text-sm text-ink/50">Summary of weekly insights</p>
            </div>
            <Switch
              checked={formData.weeklyDigest}
              onCheckedChange={(checked) => setFormData({ ...formData, weeklyDigest: checked })}
            />
          </div>
        </div>
      </section>

      {/* Preferences section */}
      <section className="sketch-border bg-card p-6">
        <h2 className="font-sketch text-2xl font-bold text-ink mb-6">Preferences</h2>
        
        <div className="space-y-4">
          <div className="space-y-2 max-w-md">
            <Label className="font-sketch text-lg">Theme</Label>
            <Select
              value={formData.theme}
              onValueChange={(value) => setFormData({ ...formData, theme: value })}
            >
              <SelectTrigger className="sketch-border-thin">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="sketch-border bg-card">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 max-w-md">
            <Label className="font-sketch text-lg">Default profile</Label>
            <Select
              value={formData.defaultProfileId}
              onValueChange={(value) => setFormData({ ...formData, defaultProfileId: value })}
            >
              <SelectTrigger className="sketch-border-thin">
                <SelectValue placeholder="Select default profile" />
              </SelectTrigger>
              <SelectContent className="sketch-border bg-card">
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.profileName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-ink/50">Profile to show when you log in</p>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="sketch-border bg-sticky-pink p-6" style={{ transform: 'rotate(-0.3deg)' }}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="font-sketch text-2xl font-bold text-ink">Danger Zone</h2>
        </div>
        
        <p className="text-ink/70 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <Button 
          variant="destructive" 
          className="sketch-border"
          onClick={() => {
            // TODO: Implement account deletion
            alert("Account deletion would be implemented here")
          }}
        >
          Delete Account
        </Button>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground font-sketch text-lg"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="text-green-600 font-sketch">Changes saved!</span>
        )}
      </div>
    </div>
  )
}
