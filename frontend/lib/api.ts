import type { Profile } from "@/lib/mock-data"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000"

const TOKEN_STORAGE_KEY = "snoop_access_token"

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function getApiBaseUrl(): string {
  return API_BASE_URL
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const CURRENT_PROFILE_STORAGE_KEY = "snoop_current_profile_id"

export const AUTH_SESSION_EXPIRED_EVENT = "snoop:session-expired"

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1]
    if (!segment) return null
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="))
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Returns true if token is missing or past its exp claim (backend also enforces this). */
export function isAccessTokenExpired(token: string | null): boolean {
  if (!token) return true
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp
  if (typeof exp !== "number") return false
  return Date.now() >= exp * 1000
}

export function getValidAccessToken(): string | null {
  const token = getAccessToken()
  if (!token || isAccessTokenExpired(token)) {
    clearAuthStorage()
    return null
  }
  return token
}

export function clearAuthStorage(): void {
  clearAccessToken()
  if (typeof window !== "undefined") {
    localStorage.removeItem(CURRENT_PROFILE_STORAGE_KEY)
  }
}

export function notifySessionExpired(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT))
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data.detail === "string") return data.detail
    if (Array.isArray(data.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg ?? "Validation error").join(", ")
    }
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || "Request failed"
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers = new Headers(options.headers)

  if (authenticated) {
    const token = getValidAccessToken()
    if (!token) {
      notifySessionExpired()
      throw new ApiError("Session expired. Please log in again.", 401)
    }
    headers.set("Authorization", `Bearer ${token}`)
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      clearAuthStorage()
      notifySessionExpired()
    }
    throw new ApiError(await parseErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

type TokenResponse = {
  access_token: string
  token_type: string
}

type CurrentUserResponse = {
  id: number
  email: string
}

export async function signupWithEmail(
  email: string,
  password: string,
): Promise<TokenResponse> {
  return apiFetch<TokenResponse>(
    "/auth/signup",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  )
}

/** Backend expects OAuth2 form: username = email */
export async function loginWithPassword(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams()
  body.set("username", email)
  body.set("password", password)

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status)
  }

  return response.json() as Promise<TokenResponse>
}

export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  return apiFetch<CurrentUserResponse>("/auth/me")
}

export function mapApiUserToAppUser(
  apiUser: CurrentUserResponse,
  displayName?: string,
) {
  const emailLocal = apiUser.email.split("@")[0] ?? apiUser.email
  return {
    id: String(apiUser.id),
    name: displayName?.trim() || emailLocal,
    email: apiUser.email,
    defaultProfileId: null as string | null,
    notificationPreferences: {
      email: true,
      push: true,
      weekly: false,
    },
    theme: "light" as const,
  }
}

export type MonitoringProfileResponse = {
  id: number
  profile_name: string
  phone_number: string
  company_name: string
  industry: string
  product_description: string
  competitors: string[]
  keywords: Record<string, unknown>
}

export type MonitoringProfileCreatePayload = {
  profile_name: string
  phone_number: string
  company_name: string
  industry: string
  product_description: string
  competitors: string[]
}

export function getStoredCurrentProfileId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_PROFILE_STORAGE_KEY)
}

export function setStoredCurrentProfileId(profileId: string | null): void {
  if (typeof window === "undefined") return
  if (profileId) {
    localStorage.setItem(CURRENT_PROFILE_STORAGE_KEY, profileId)
  } else {
    localStorage.removeItem(CURRENT_PROFILE_STORAGE_KEY)
  }
}

function keywordsToStringList(keywords: Record<string, unknown>): string[] {
  const all = keywords.all_keywords
  if (Array.isArray(all)) {
    return all.filter((k): k is string => typeof k === "string")
  }

  const groups = keywords.keyword_groups
  if (groups && typeof groups === "object" && !Array.isArray(groups)) {
    const competitors = (groups as Record<string, unknown>).competitors
    if (Array.isArray(competitors)) {
      return competitors.filter((k): k is string => typeof k === "string")
    }
  }

  return []
}

export function mapApiProfileToAppProfile(
  apiProfile: MonitoringProfileResponse,
): Profile {
  const now = new Date().toISOString()

  return {
    id: String(apiProfile.id),
    profileName: apiProfile.profile_name,
    phoneNumber: apiProfile.phone_number,
    companyName: apiProfile.company_name,
    industry: apiProfile.industry,
    productDescription: apiProfile.product_description,
    competitors: apiProfile.competitors,
    keywords: keywordsToStringList(apiProfile.keywords),
    createdAt: now,
    updatedAt: now,
  }
}

export async function fetchProfiles(): Promise<MonitoringProfileResponse[]> {
  return apiFetch<MonitoringProfileResponse[]>("/profiles/")
}

export async function createProfile(
  payload: MonitoringProfileCreatePayload,
): Promise<MonitoringProfileResponse> {
  return apiFetch<MonitoringProfileResponse>("/profiles/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function suggestCompetitors(payload: {
  company_name: string
  industry: string
  product_description: string
}): Promise<string[]> {
  const result = await apiFetch<{ suggested_competitors: string[] }>(
    "/profiles/suggest-competitors",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
  return result.suggested_competitors
}

export type KeywordExportDocument = {
  exported_at: string
  user_id: number
  profile_id: number
  profile_name: string
  phone_number: string
  keywords: Record<string, unknown>
}

export async function fetchProfileKeywordExport(
  profileId: string | number,
): Promise<KeywordExportDocument> {
  return apiFetch<KeywordExportDocument>(`/profiles/${profileId}/keywords`)
}

/** Regenerate keywords from the profile's current fields (one export per profile). */
export async function createProfileKeywords(
  profileId: string | number,
): Promise<KeywordExportDocument> {
  return apiFetch<KeywordExportDocument>(`/profiles/${profileId}/keywords`, {
    method: "POST",
  })
}

export async function updateProfileKeywords(
  profileId: string | number,
  keywords: Record<string, unknown>,
): Promise<KeywordExportDocument> {
  return apiFetch<KeywordExportDocument>(`/profiles/${profileId}/keywords`, {
    method: "PUT",
    body: JSON.stringify({ keywords }),
  })
}
