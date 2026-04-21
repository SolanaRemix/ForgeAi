import { Router } from "express";
import { db } from "../lib/db";
import { staticProjects } from "../data/static";

export const projectsRouter = Router();

projectsRouter.get("/projects", async (_req, res) => {
  if (db.enabled) {
    const rows = await db.query<{ id: string; name: string; status: "stable" | "warning" | "repairing"; framework: string; updated_at: string }>(
      "select id, name, status, framework, updated_at from projects order by name asc"
    );
    res.json(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        status: row.status,
        framework: row.framework,
        updatedAt: row.updated_at
      }))
    );
    return;
  }

  res.json(staticProjects);
});
