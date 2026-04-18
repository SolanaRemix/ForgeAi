$ErrorActionPreference = "Stop"

Write-Host "[ForgeAI] Deterministic scaffold bootstrap started"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path "backend/package.json")) { throw "Missing backend/package.json" }
if (-not (Test-Path "frontend/package.json")) { throw "Missing frontend/package.json" }

Push-Location backend
npm ci
Pop-Location

Push-Location frontend
npm ci
Pop-Location

Write-Host "[ForgeAI] Bootstrap completed successfully"
