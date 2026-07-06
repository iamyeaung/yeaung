# ============================================================================
# /qa-tester - Automated test sweep (READ-ONLY, non-destructive)  [Windows]
# ----------------------------------------------------------------------------
# PowerShell 5.1 equivalent of run_qa.sh for Windows-primary machines.
# Runs backend npm run test + ruff, frontend Jest (coverage) + prettier CHECK.
# NEVER formats/writes source. Never aborts on a failing suite - failures are
# read from the captured output and recorded as findings by /qa-tester.
#
# Usage (from repo root):
#   powershell -File .agents/skills/qa-tester/scripts/run_qa.ps1            # full
#   powershell -File .agents/skills/qa-tester/scripts/run_qa.ps1 backend
#   powershell -File .agents/skills/qa-tester/scripts/run_qa.ps1 frontend
# ============================================================================
param([ValidateSet('all','backend','frontend')][string]$Target = 'all')

$ErrorActionPreference = 'Continue'
$Root     = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
$Backend  = Join-Path $Root 'frontend'
$Frontend = Join-Path $Root 'frontend'

function Section($t) { Write-Host "`n============================================================" ; Write-Host "== $t" ; Write-Host "============================================================" }

function Py-Run {
  # pipenv preferred, else local venv python -m, else global python -m
  if (Get-Command pipenv -ErrorAction SilentlyContinue) { pipenv run @args }
  elseif (Test-Path "$Backend\venv\Scripts\python.exe") { & "$Backend\venv\Scripts\python.exe" -m @args }
  else { python -m @args }
}

function QA-Backend {
  Section 'BACKEND - npm run test'
  Push-Location $Backend; npm run test; Pop-Location
  Section 'BACKEND - ruff lint check (NO auto-fix)'
  Push-Location $Backend; npm run lint; Pop-Location
}

function QA-Frontend {
  Section 'FRONTEND - Jest (one-shot + coverage)'
  Push-Location $Frontend; $env:CI = 'true'; npm test -- --coverage --watchAll=false; Remove-Item Env:\CI; Pop-Location
  Section 'FRONTEND - prettier check (NO auto-format)'
  Push-Location $Frontend; npx prettier --check "src/**/*.{js,jsx,css,md}"; Pop-Location
}

Section "QA SWEEP START - target: $Target - root: $Root"
switch ($Target) {
  'backend'  { QA-Backend }
  'frontend' { QA-Frontend }
  'all'      { QA-Backend; QA-Frontend }
}
Section 'QA SWEEP COMPLETE - review output above and record findings'
