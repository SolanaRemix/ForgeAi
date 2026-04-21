# ForgeAI Scaffold

Deterministic full-stack scaffold for a Replit-style neon dashboard with governance modules.

## Structure

- `backend/` Node.js + Express + WebSocket + Supabase/Postgres integration layer
- `frontend/` Next.js neon dashboard with animated tabs and stabilator view
- `governance/repo-brain/modules.json` immutable Repo-Brain governance definitions
- `bootstrap.ps1` deterministic install/bootstrap script

## Quick Start

1. Copy env templates:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.local.example` -> `frontend/.env.local`
   - Generate a strong JWT secret (example): `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
2. Bootstrap:
   - `pwsh ./bootstrap.ps1`
3. Run backend:
   - `cd backend && npm run dev`
4. Run frontend:
   - `cd frontend && npm run dev`

## Supabase/Postgres Tables (expected)

- `projects(id, name, status, framework, updated_at)`
- `pricing_tiers(id, name, monthly_usd, features)`

If `DATABASE_URL` is unset, backend serves deterministic fallback data.
Auth endpoints also run in scaffold mode with in-memory users unless persistent storage is configured.

## Governance Modules

Repo-Brain modules included:
Hospital, Detect, Doctor, Surgeon, Verify, AI-Guard, Firewall, Vitals, Fleet, Autopsy, Genome, Fix.Safe.
