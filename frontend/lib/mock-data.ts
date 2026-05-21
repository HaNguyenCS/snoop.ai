// Mock data for snoop.ai profiles and dashboard
// TODO: Replace with actual API calls when backend is ready

export interface Profile {
  id: string
  profileName: string
  companyName: string
  industry: string
  website: string
  competitors: string[]
  keywords: string[]
  createdAt: string
  updatedAt: string
}

export interface CompetitorUpdate {
  id: string
  company: string
  event: string
  score: number
  time: string
  insight: string
  type: "pricing" | "hiring" | "content" | "product" | "funding" | "social"
}

export interface AiInsight {
  id: string
  title: string
  description: string
  confidence: number
  createdAt: string
}

export interface DashboardStats {
  updatesScanned: number
  relevantEvents: number
  noiseFiltered: number
  aiInsights: number
  updatesChange: string
  eventsChange: string
  insightsChange: string
}

export interface ProfileDashboardData {
  stats: DashboardStats
  competitorUpdates: CompetitorUpdate[]
  aiInsights: AiInsight[]
  filteringFunnel: {
    rawUpdates: number
    afterDedup: number
    relevantSignals: number
    sentToAi: number
    actionableInsights: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  defaultProfileId: string | null
  notificationPreferences: {
    email: boolean
    push: boolean
    weekly: boolean
  }
  theme: "light" | "dark" | "system"
}

// Mock profiles
export const mockProfiles: Profile[] = [
  {
    id: "profile-1",
    profileName: "Acme AI Monitoring",
    companyName: "Acme AI",
    industry: "AI/ML Infrastructure",
    website: "https://acme.ai",
    competitors: ["LaunchFlow", "Northbeam", "DataPilot", "CloudScale"],
    keywords: ["AI infrastructure", "model serving", "MLOps", "enterprise AI"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "profile-2",
    profileName: "LaunchFlow Watch",
    companyName: "LaunchFlow",
    industry: "Developer Tools",
    website: "https://launchflow.io",
    competitors: ["Vercel", "Netlify", "Railway", "Render"],
    keywords: ["deployment", "CI/CD", "serverless", "developer experience"],
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-18T11:00:00Z",
  },
  {
    id: "profile-3",
    profileName: "Northbeam Intel",
    companyName: "Northbeam",
    industry: "Marketing Analytics",
    website: "https://northbeam.io",
    competitors: ["Triple Whale", "Rockerbox", "Attribution", "Measured"],
    keywords: ["attribution", "marketing analytics", "ROAS", "media mix"],
    createdAt: "2024-02-10T08:00:00Z",
    updatedAt: "2024-02-19T16:00:00Z",
  },
]

// Mock dashboard data per profile
export const mockDashboardData: Record<string, ProfileDashboardData> = {
  "profile-1": {
    stats: {
      updatesScanned: 1842,
      relevantEvents: 147,
      noiseFiltered: 92,
      aiInsights: 27,
      updatesChange: "+12%",
      eventsChange: "+8%",
      insightsChange: "+5",
    },
    competitorUpdates: [
      {
        id: "update-1",
        company: "LaunchFlow",
        event: "Changed enterprise pricing",
        score: 92,
        time: "2h ago",
        insight: "Possible upmarket push. Review enterprise packaging.",
        type: "pricing",
      },
      {
        id: "update-2",
        company: "Northbeam",
        event: "Posted 6 AI infrastructure roles",
        score: 88,
        time: "5h ago",
        insight: "Hiring suggests investment in model serving and AI reliability.",
        type: "hiring",
      },
      {
        id: "update-3",
        company: "DataPilot",
        event: "Published SOC 2 compliance messaging",
        score: 76,
        time: "1d ago",
        insight: "May be positioning for enterprise buyers.",
        type: "content",
      },
      {
        id: "update-4",
        company: "CloudScale",
        event: "Announced Series B funding",
        score: 95,
        time: "3h ago",
        insight: "Significant runway increase. Expect aggressive expansion.",
        type: "funding",
      },
    ],
    aiInsights: [
      {
        id: "insight-1",
        title: "Market shift detected",
        description: "3 competitors raised enterprise prices this week",
        confidence: 94,
        createdAt: "2024-02-20T10:00:00Z",
      },
      {
        id: "insight-2",
        title: "Hiring trend",
        description: "AI/ML roles up 40% across tracked companies",
        confidence: 87,
        createdAt: "2024-02-20T09:00:00Z",
      },
      {
        id: "insight-3",
        title: "Feature convergence",
        description: "Multiple competitors adding similar API features",
        confidence: 82,
        createdAt: "2024-02-19T15:00:00Z",
      },
    ],
    filteringFunnel: {
      rawUpdates: 1842,
      afterDedup: 642,
      relevantSignals: 147,
      sentToAi: 27,
      actionableInsights: 12,
    },
  },
  "profile-2": {
    stats: {
      updatesScanned: 956,
      relevantEvents: 89,
      noiseFiltered: 88,
      aiInsights: 15,
      updatesChange: "+5%",
      eventsChange: "+3%",
      insightsChange: "+2",
    },
    competitorUpdates: [
      {
        id: "update-5",
        company: "Vercel",
        event: "Launched new edge functions pricing",
        score: 94,
        time: "1h ago",
        insight: "Aggressive pricing may pressure margins. Review your pricing.",
        type: "pricing",
      },
      {
        id: "update-6",
        company: "Netlify",
        event: "Released AI-powered deployment previews",
        score: 85,
        time: "4h ago",
        insight: "Feature differentiation in preview tooling.",
        type: "product",
      },
      {
        id: "update-7",
        company: "Railway",
        event: "Expanded to EU region",
        score: 72,
        time: "1d ago",
        insight: "Geographic expansion may affect GDPR-conscious customers.",
        type: "product",
      },
    ],
    aiInsights: [
      {
        id: "insight-4",
        title: "Pricing war signals",
        description: "2 major competitors cut prices this month",
        confidence: 91,
        createdAt: "2024-02-20T11:00:00Z",
      },
      {
        id: "insight-5",
        title: "AI feature race",
        description: "All tracked competitors now offer AI-assisted features",
        confidence: 85,
        createdAt: "2024-02-19T14:00:00Z",
      },
    ],
    filteringFunnel: {
      rawUpdates: 956,
      afterDedup: 412,
      relevantSignals: 89,
      sentToAi: 15,
      actionableInsights: 8,
    },
  },
  "profile-3": {
    stats: {
      updatesScanned: 1234,
      relevantEvents: 112,
      noiseFiltered: 90,
      aiInsights: 21,
      updatesChange: "+8%",
      eventsChange: "+6%",
      insightsChange: "+4",
    },
    competitorUpdates: [
      {
        id: "update-8",
        company: "Triple Whale",
        event: "Announced Shopify Plus integration",
        score: 89,
        time: "3h ago",
        insight: "Deepening e-commerce focus. May capture more DTC brands.",
        type: "product",
      },
      {
        id: "update-9",
        company: "Rockerbox",
        event: "Published case study with major CPG brand",
        score: 78,
        time: "6h ago",
        insight: "Enterprise credibility play. Consider similar content.",
        type: "content",
      },
      {
        id: "update-10",
        company: "Attribution",
        event: "Hiring VP of Sales",
        score: 71,
        time: "2d ago",
        insight: "Sales push incoming. Expect increased competitive pressure.",
        type: "hiring",
      },
    ],
    aiInsights: [
      {
        id: "insight-6",
        title: "Integration arms race",
        description: "Competitors adding 2x more integrations than last quarter",
        confidence: 88,
        createdAt: "2024-02-20T08:00:00Z",
      },
      {
        id: "insight-7",
        title: "Enterprise pivot",
        description: "Multiple competitors focusing on enterprise messaging",
        confidence: 83,
        createdAt: "2024-02-19T12:00:00Z",
      },
    ],
    filteringFunnel: {
      rawUpdates: 1234,
      afterDedup: 521,
      relevantSignals: 112,
      sentToAi: 21,
      actionableInsights: 10,
    },
  },
}

// Mock user
export const mockUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@company.com",
  defaultProfileId: "profile-1",
  notificationPreferences: {
    email: true,
    push: true,
    weekly: true,
  },
  theme: "light",
}

// Helper functions
export function getProfileById(id: string): Profile | undefined {
  return mockProfiles.find((p) => p.id === id)
}

export function getDashboardDataByProfileId(id: string): ProfileDashboardData | undefined {
  return mockDashboardData[id]
}

export function getDefaultProfile(): Profile {
  return mockProfiles[0]
}
