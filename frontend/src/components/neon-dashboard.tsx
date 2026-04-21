"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { aiStacks, apiBaseUrl, navTabs } from "@/lib/constants";

type Project = { id: string; name: string; status: string; framework: string; updatedAt: string };
type Pricing = { id: string; name: string; monthlyUsd: number; features: string[] };
type Integration = { id: string; name: string; status: string };

const initialProjects: Project[] = [
  { id: "airdrop", name: "AirDrop", status: "stable", framework: "Next.js", updatedAt: "n/a" },
  { id: "ai-bot", name: "AI Bot", status: "repairing", framework: "Express", updatedAt: "n/a" },
  { id: "webos", name: "WebOS", status: "warning", framework: "React", updatedAt: "n/a" },
  { id: "login-form", name: "Login Form", status: "stable", framework: "Next.js", updatedAt: "n/a" },
  { id: "ecommerce", name: "E-commerce Landing Page", status: "stable", framework: "Astro", updatedAt: "n/a" }
];

const initialPricing: Pricing[] = [
  { id: "starter", name: "Starter", monthlyUsd: 19, features: ["3 projects", "Repo scan", "Basic CI verify"] },
  { id: "pro", name: "Pro", monthlyUsd: 79, features: ["25 projects", "Auto-repair", "AI-Guard + Firewall"] },
  { id: "fleet", name: "Fleet", monthlyUsd: 249, features: ["Unlimited projects", "Fleet governance", "Fix.Safe rollbacks"] }
];

const initialIntegrations: Integration[] = [
  { id: "github-sync", name: "GitHub Sync", status: "ready" },
  { id: "vercel-deploy", name: "Vercel Deploy", status: "ready" },
  { id: "team-mode", name: "Team Mode", status: "beta" }
];

export function NeonDashboard() {
  const [active, setActive] = useState<(typeof navTabs)[number]["id"]>("dashboard");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [pricing, setPricing] = useState<Pricing[]>(initialPricing);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [socketState, setSocketState] = useState("disconnected");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    void fetch(`${apiBaseUrl}/projects`).then((r) => r.json()).then(setProjects).catch(() => undefined);
    void fetch(`${apiBaseUrl}/pricing`).then((r) => r.json()).then(setPricing).catch(() => undefined);
    void fetch(`${apiBaseUrl}/integrations`).then((r) => r.json()).then(setIntegrations).catch(() => undefined);

    const wsBase = apiBaseUrl.replace(/^http/, "ws").replace(/\/api$/, "");
    const ws = new WebSocket(`${wsBase}/ws`);
    ws.onopen = () => setSocketState("live");
    ws.onclose = () => setSocketState("offline");
    ws.onerror = () => setSocketState("error");

    return () => ws.close();
  }, []);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(payload?.error?.message ?? "Login failed");
      }
      setAuthMessage("Login successful.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Login failed. Check credentials.");
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(payload?.error?.message ?? "Signup failed");
      }
      setAuthMessage("Signup successful.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Signup failed. Try a different email.");
    }
  };

  return (
    <main className="shell">
      <header className="topbar">
        <h1>ForgeAI Control Grid</h1>
        <span className="badge">Vitals: {socketState}</span>
      </header>

      <nav className="floating-nav">
        {navTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActive(tab.id)} className={active === tab.id ? "active" : ""}>
            {tab.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.section
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
          className="panel"
        >
          {active === "dashboard" && (
            <div className="grid">
              {projects.map((project) => (
                <article key={project.id} className="card">
                  <h3>{project.name}</h3>
                  <p>{project.framework}</p>
                  <p>Status: {project.status}</p>
                </article>
              ))}
            </div>
          )}

          {active === "pricing" && (
            <div className="grid">
              {pricing.map((tier) => (
                <article key={tier.id} className="card">
                  <h3>{tier.name}</h3>
                  <p>${tier.monthlyUsd}/month</p>
                  <ul>{tier.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </article>
              ))}
            </div>
          )}

          {active === "auth" && (
            <div className="auth-wrap">
              <form className="card" onSubmit={handleLoginSubmit}>
                <h3>Login</h3>
                <input name="email" placeholder="email" type="email" required />
                <input name="password" placeholder="password" type="password" minLength={8} required />
                <button type="submit">Sign In</button>
              </form>
              <form className="card" onSubmit={handleSignupSubmit}>
                <h3>Signup</h3>
                <input name="name" placeholder="name" required />
                <input name="email" placeholder="email" type="email" required />
                <input name="password" placeholder="password" type="password" minLength={8} required />
                <button type="submit">Create Account</button>
              </form>
              {authMessage ? <p>{authMessage}</p> : null}
            </div>
          )}

          {active === "integrations" && (
            <div className="grid">
              {integrations.map((integration) => (
                <article className="card" key={integration.id}>
                  <h3>{integration.name}</h3>
                  <p>{integration.status}</p>
                </article>
              ))}
              <article className="card">
                <h3>AI Stack</h3>
                <div className="stack-tabs">{aiStacks.map((stack) => <span key={stack}>{stack}</span>)}</div>
              </article>
            </div>
          )}

          {active === "stabilator" && (
            <div className="stabilator">
              <div className="gyro">
                <div className="ring ring-1" />
                <div className="ring ring-2" />
                <div className="ring ring-3" />
              </div>
              <p>Repo stability is being actively balanced by Stabilator Mesh.</p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
