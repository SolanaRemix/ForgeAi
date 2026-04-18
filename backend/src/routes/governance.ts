import { Router } from "express";
import { governanceModules } from "../data/static";

export const governanceRouter = Router();

governanceRouter.get("/governance/modules", (_req, res) => {
  res.json(
    governanceModules.map((name) => ({
      name,
      enabled: true,
      mode: "enforce"
    }))
  );
});
