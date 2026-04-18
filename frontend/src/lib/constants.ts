export const aiStacks = ["GPT-4o", "GPT-5.2", "Gemini Pro", "Claude Opus", "Farcaster"] as const;

export const navTabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pricing", label: "Pricing" },
  { id: "auth", label: "Auth" },
  { id: "integrations", label: "Integrations" },
  { id: "stabilator", label: "Stabilator" }
] as const;

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";
