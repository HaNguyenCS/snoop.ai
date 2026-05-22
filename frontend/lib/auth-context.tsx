"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { mockProfiles, mockUser, type Profile, type User } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  currentProfile: Profile | null
  profiles: Profile[]
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setCurrentProfile: (profileId: string) => void
  addProfile: (profile: Omit<Profile, "id" | "createdAt" | "updatedAt">) => Profile
  updateProfile: (id: string, data: Partial<Profile>) => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with actual auth state management when backend is ready
  const [user, setUser] = useState<User | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles)
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)

  const currentProfile = currentProfileId 
    ? profiles.find((p) => p.id === currentProfileId) || null 
    : null

  const login = useCallback(async (email: string, password: string) => {
    // TODO: Implement actual login API call
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })
    // const data = await response.json()
    
    // Mock login - simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUser(mockUser)
    setCurrentProfileId(mockUser.defaultProfileId)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    // TODO: Implement Google OAuth
    // window.location.href = '/api/auth/google'
    
    // Mock Google login
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUser(mockUser)
    setCurrentProfileId(mockUser.defaultProfileId)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // TODO: Implement actual signup API call
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password }),
    // })
    // const data = await response.json()
    
    // Mock signup
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      defaultProfileId: null,
      notificationPreferences: {
        email: true,
        push: true,
        weekly: false,
      },
      theme: "light",
    }
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    // TODO: Implement actual logout API call
    // await fetch('/api/auth/logout', { method: 'POST' })
    
    setUser(null)
    setCurrentProfileId(null)
  }, [])

  const setCurrentProfile = useCallback((profileId: string) => {
    setCurrentProfileId(profileId)
    // TODO: Persist selection to backend
    // await fetch('/api/user/default-profile', {
    //   method: 'PUT',
    //   body: JSON.stringify({ profileId }),
    // })
  }, [])

  const addProfile = useCallback((profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">) => {
    // TODO: Implement actual API call
    // const response = await fetch('/api/profiles', {
    //   method: 'POST',
    //   body: JSON.stringify(profileData),
    // })
    // const newProfile = await response.json()
    
    const newProfile: Profile = {
      ...profileData,
      id: `profile-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProfiles((prev) => [...prev, newProfile])
    setCurrentProfileId(newProfile.id)
    return newProfile
  }, [])

  const updateProfile = useCallback((id: string, data: Partial<Profile>) => {
    // TODO: Implement actual API call
    // await fetch(`/api/profiles/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data),
    // })
    
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      )
    )
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    // TODO: Implement actual API call
    // await fetch('/api/user', {
    //   method: 'PUT',
    //   body: JSON.stringify(data),
    // })
    
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        currentProfile,
        profiles,
        login,
        loginWithGoogle,
        signup,
        logout,
        setCurrentProfile,
        addProfile,
        updateProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
