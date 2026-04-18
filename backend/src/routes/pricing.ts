import { Router } from "express";
import { db } from "../lib/db";
import { staticPricing } from "../data/static";

export const pricingRouter = Router();

pricingRouter.get("/pricing", async (_req, res) => {
  if (db.enabled) {
    const rows = await db.query<{ id: string; name: string; monthly_usd: number; features: string[] }>(
      "select id, name, monthly_usd, features from pricing_tiers order by monthly_usd asc"
    );
    res.json(rows.map((row) => ({ id: row.id, name: row.name, monthlyUsd: row.monthly_usd, features: row.features })));
    return;
  }

  res.json(staticPricing);
});
