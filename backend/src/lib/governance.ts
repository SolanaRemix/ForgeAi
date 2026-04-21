import fs from "node:fs";
import path from "node:path";

type GovernanceModule = {
  name: string;
  description: string;
  enforced: boolean;
};

type GovernanceManifest = {
  version: string;
  immutable: boolean;
  modules: GovernanceModule[];
};

const governanceManifestPath = path.resolve(process.cwd(), "..", "governance", "repo-brain", "modules.json");

function readManifest(): GovernanceManifest {
  const raw = fs.readFileSync(governanceManifestPath, "utf8");
  return JSON.parse(raw) as GovernanceManifest;
}

export function listGovernanceModules() {
  const manifest = readManifest();
  return manifest.modules.map((module) => ({
    name: module.name,
    enabled: module.enforced,
    mode: "enforce"
  }));
}

