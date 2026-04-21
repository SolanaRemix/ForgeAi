import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const GovernanceManifestSchema = z.object({
  version: z.string(),
  immutable: z.boolean(),
  modules: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      enforced: z.boolean()
    })
  )
});

type GovernanceManifest = z.infer<typeof GovernanceManifestSchema>;

const governanceManifestPath = path.resolve(__dirname, "..", "..", "..", "governance", "repo-brain", "modules.json");
let cachedManifest: GovernanceManifest | null = null;

function readManifest(): GovernanceManifest {
  if (cachedManifest) {
    return cachedManifest;
  }

  try {
    const raw = fs.readFileSync(governanceManifestPath, "utf8");
    const parsed = GovernanceManifestSchema.parse(JSON.parse(raw));
    cachedManifest = parsed;
    return parsed;
  } catch (error) {
    throw new Error(`Unable to read governance manifest at ${governanceManifestPath}: ${String(error)}`);
  }
}

export function listGovernanceModules() {
  const manifest = readManifest();
  return manifest.modules.map((module) => ({
    name: module.name,
    enabled: module.enforced,
    mode: "enforce"
  }));
}
