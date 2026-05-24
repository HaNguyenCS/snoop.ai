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
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthStorage,
  createProfile,
  updateProfile as updateProfileApi,
  fetchCurrentUser,
  fetchProfiles,
  getValidAccessToken,
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
  updateProfile: (
    id: string,
    profile: Omit<Profile, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Profile>
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

  const resetSession = useCallback(() => {
    clearAuthStorage()
    setUser(null)
    setProfiles([])
    setCurrentProfileId(null)
  }, [])

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
    const token = getValidAccessToken()
    if (!token) {
      setIsInitializing(false)
      return
    }

    loadSession()
      .catch(() => {
        resetSession()
      })
      .finally(() => {
        setIsInitializing(false)
      })
  }, [loadSession, resetSession])

  useEffect(() => {
    const handleSessionExpired = () => {
      resetSession()
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [resetSession])

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
    resetSession()
  }, [resetSession])

  const setCurrentProfile = useCallback((profileId: string) => {
    setCurrentProfileId(profileId)
    setStoredCurrentProfileId(profileId)
  }, [])

  const addProfile = useCallback(
    async (profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">) => {
      const created = await createProfile({
        profile_name: profileData.profileName.trim(),
        phone_number: profileData.phoneNumber.trim(),
        company_name: profileData.companyName,
        industry: profileData.industry.trim() || "General",
        product_description: profileData.productDescription.trim(),
        competitors: profileData.competitors,
      })

      const mapped = mapApiProfileToAppProfile(created)

      setProfiles((prev) => [...prev, mapped])
      setCurrentProfileId(mapped.id)
      setStoredCurrentProfileId(mapped.id)

      return mapped
    },
    [],
  )

  const updateProfile = useCallback(
    async (id: string, profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">) => {
      const updated = await updateProfileApi(id, {
        profile_name: profileData.profileName.trim(),
        phone_number: profileData.phoneNumber.trim(),
        company_name: profileData.companyName,
        industry: profileData.industry.trim() || "General",
        product_description: profileData.productDescription.trim(),
        competitors: profileData.competitors,
      })

      const mapped = mapApiProfileToAppProfile(updated)
      const previous = profiles.find((p) => p.id === id)

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...mapped,
                createdAt: previous?.createdAt ?? mapped.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      )

      return mapped
    },
    [profiles],
  )

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
