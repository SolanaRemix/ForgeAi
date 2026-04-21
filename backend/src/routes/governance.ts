import { Router } from "express";
import { listGovernanceModules } from "../lib/governance";

export const governanceRouter = Router();

governanceRouter.get("/governance/modules", (_req, res) => {
  res.json(listGovernanceModules());
});
