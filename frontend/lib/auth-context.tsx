"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import {
  clearAccessToken,
  createProfile,
  fetchCurrentUser,
  fetchProfiles,
  getAccessToken,
  getStoredCurrentProfileId,
  loginWithPassword,
  mapApiProfileToAppProfile,
  mapApiUserToAppUser,
  setAccessToken,
  setStoredCurrentProfileId,
  signupWithEmail,
} from "@/lib/api"
import type { Profile, User } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  currentProfile: Profile | null
  profiles: Profile[]
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setCurrentProfile: (profileId: string) => void
  addProfile: (
    profile: Omit<Profile, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Profile>
  updateProfile: (id: string, data: Partial<Profile>) => void
  updateUser: (data: Partial<User>) => void
  refreshProfiles: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function pickCurrentProfileId(
  profiles: Profile[],
  preferredId: string | null,
): string | null {
  if (profiles.length === 0) return null
  if (preferredId && profiles.some((p) => p.id === preferredId)) {
    return preferredId
  }
  return profiles[0].id
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const currentProfile = currentProfileId
    ? profiles.find((p) => p.id === currentProfileId) || null
    : null

  const applyProfiles = useCallback((loaded: Profile[], preferredId?: string | null) => {
    setProfiles(loaded)
    const nextId = pickCurrentProfileId(
      loaded,
      preferredId ?? getStoredCurrentProfileId(),
    )
    setCurrentProfileId(nextId)
    setStoredCurrentProfileId(nextId)
  }, [])

  const refreshProfiles = useCallback(async () => {
    const apiProfiles = await fetchProfiles()
    const mapped = apiProfiles.map((p) => mapApiProfileToAppProfile(p))
    applyProfiles(mapped)
  }, [applyProfiles])

  const loadSession = useCallback(async () => {
    const apiUser = await fetchCurrentUser()
    setUser(mapApiUserToAppUser(apiUser))

    try {
      await refreshProfiles()
    } catch {
      setProfiles([])
      setCurrentProfileId(null)
      setStoredCurrentProfileId(null)
    }
  }, [refreshProfiles])

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsInitializing(false)
      return
    }

    loadSession()
      .catch(() => {
        clearAccessToken()
        setUser(null)
        setProfiles([])
        setCurrentProfileId(null)
        setStoredCurrentProfileId(null)
      })
      .finally(() => {
        setIsInitializing(false)
      })
  }, [loadSession])

  const establishSession = useCallback(
    async (accessToken: string, displayName?: string) => {
      setAccessToken(accessToken)
      const apiUser = await fetchCurrentUser()
      setUser(mapApiUserToAppUser(apiUser, displayName))

      try {
        await refreshProfiles()
      } catch {
        setProfiles([])
        setCurrentProfileId(null)
        setStoredCurrentProfileId(null)
      }
    },
    [refreshProfiles],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const { access_token } = await loginWithPassword(email, password)
      await establishSession(access_token)
    },
    [establishSession],
  )

  const loginWithGoogle = useCallback(async () => {
    throw new Error("Google sign-in is not available yet. Use email and password.")
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const { access_token } = await signupWithEmail(email, password)
      await establishSession(access_token, name)
    },
    [establishSession],
  )

  const logout = useCallback(() => {
    clearAccessToken()
    setStoredCurrentProfileId(null)
    setUser(null)
    setProfiles([])
    setCurrentProfileId(null)
  }, [])

  const setCurrentProfile = useCallback((profileId: string) => {
    setCurrentProfileId(profileId)
    setStoredCurrentProfileId(profileId)
  }, [])

  const addProfile = useCallback(
    async (profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">) => {
      const created = await createProfile({
        company_name: profileData.companyName,
        industry: profileData.industry.trim() || "General",
        product_description: profileData.productDescription.trim(),
        competitors: profileData.competitors,
      })

      const mapped = mapApiProfileToAppProfile(created, profileData.profileName)

      setProfiles((prev) => [...prev, mapped])
      setCurrentProfileId(mapped.id)
      setStoredCurrentProfileId(mapped.id)

      return mapped
    },
    [],
  )

  const updateProfile = useCallback((id: string, data: Partial<Profile>) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p,
      ),
    )
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
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
        refreshProfiles,
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
