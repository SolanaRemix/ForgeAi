import { Router } from "express";

export const integrationsRouter = Router();

integrationsRouter.get("/integrations", (_req, res) => {
  res.json([
    { id: "github-sync", name: "GitHub Sync", status: "ready" },
    { id: "vercel-deploy", name: "Vercel Deploy", status: "ready" },
    { id: "team-mode", name: "Team Mode", status: "beta" }
  ]);
});
