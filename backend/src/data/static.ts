export type Project = {
  id: string;
  name: string;
  status: "stable" | "warning" | "repairing";
  framework: string;
  updatedAt: string;
};

export type PricingTier = {
  id: string;
  name: string;
  monthlyUsd: number;
  features: string[];
};

export const staticProjects: readonly Project[] = Object.freeze([
  { id: "airdrop", name: "AirDrop", status: "stable", framework: "Next.js", updatedAt: "2026-04-18T00:00:00.000Z" },
  { id: "ai-bot", name: "AI Bot", status: "repairing", framework: "Express", updatedAt: "2026-04-18T00:00:00.000Z" },
  { id: "webos", name: "WebOS", status: "warning", framework: "React", updatedAt: "2026-04-18T00:00:00.000Z" },
  { id: "login-form", name: "Login Form", status: "stable", framework: "Next.js", updatedAt: "2026-04-18T00:00:00.000Z" },
  { id: "ecommerce", name: "E-commerce Landing Page", status: "stable", framework: "Astro", updatedAt: "2026-04-18T00:00:00.000Z" }
]);

export const staticPricing: readonly PricingTier[] = Object.freeze([
  { id: "starter", name: "Starter", monthlyUsd: 19, features: ["3 projects", "Repo scan", "Basic CI verify"] },
  { id: "pro", name: "Pro", monthlyUsd: 79, features: ["25 projects", "Auto-repair", "AI-Guard + Firewall"] },
  { id: "fleet", name: "Fleet", monthlyUsd: 249, features: ["Unlimited projects", "Fleet governance", "Fix.Safe rollbacks"] }
]);
