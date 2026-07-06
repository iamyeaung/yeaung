# ============================================================================
# /safe-commit - Phase automation helper  [Windows PowerShell 5.1]
# ----------------------------------------------------------------------------
# PowerShell equivalent of safe_commit_check.sh. Gathers evidence and runs
# checks; approval gates stay with the agent/user.
#
#   safety     (Phase 1, read-only)  Sensitive-file sweep (tracked / loose / .gitignore gaps)
#   format     (Phase 2, WRITE)      Auto-format touched sides only
#   precheck   (Phase 3, read-only)  Tests for touched sides + doc-link integrity
#   summary    (Phase 6, read-only)  Change summary for atomic commit grouping
#
# Usage (from repo root):
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 safety
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 format
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 precheck
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 summary
# ============================================================================
param([ValidateSet('safety','format','precheck','summary')][string]$Cmd = 'safety')

$ErrorActionPreference = 'Continue'
$Root     = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
$Backend  = Join-Path $Root 'frontend'
$Frontend = Join-Path $Root 'frontend'
Set-Location $Root

# .env.example / .env.sample are templates and intentionally tracked - excluded.
$SensitiveRe = '(\.env($|\.local|\.production|\.development)|\.db$|\.sqlite3?$|\.pem$|\.key$|service_account.*\.json|credentials/|secrets?\.|token.*\.json|\.p12$)'
# ALLOWLIST: intentionally-versioned source-of-truth data DBs (not a leak).
# See git_workflow.md section 4 + database_rules.
$AllowlistRe = 'frontend/.*'

function Section($t) { Write-Host "`n============================================================"; Write-Host "== $t"; Write-Host "============================================================" }
function Py-Run { if (Get-Command pipenv -ErrorAction SilentlyContinue) { Push-Location $Backend; pipenv run @args; Pop-Location } elseif (Test-Path "$Backend\venv\Scripts\python.exe") { Push-Location $Backend; & ".\venv\Scripts\python.exe" -m @args; Pop-Location } else { Push-Location $Backend; python -m @args; Pop-Location } }

function Touched { @(git diff --name-only) + @(git diff --cached --name-only) + @(git ls-files --others --exclude-standard) | Sort-Object -Unique }
function Touches-Backend  { (Touched) -match '^frontend/' }
function Touches-Frontend { (Touched) -match '^frontend/' }

function Cmd-Safety {
  Section "PHASE 1 - DATA SAFETY SWEEP (read-only)"
  $bad = $false

  Write-Host "--- 1a. TRACKED files matching sensitive patterns (already in git history!) ---"
  $tracked = git ls-files | Where-Object { $_ -match $SensitiveRe -and $_ -notmatch $AllowlistRe }
  if ($tracked) { $tracked | ForEach-Object { Write-Host "  [LEAKED] $_" }; $bad = $true } else { Write-Host "  [OK] none" }

  Write-Host "`n--- 1b. UNTRACKED + NOT-IGNORED sensitive files (one 'git add -A' from leaking) ---"
  $loose = git ls-files --others --exclude-standard | Where-Object { $_ -match $SensitiveRe -and $_ -notmatch $AllowlistRe }
  if ($loose) { $loose | ForEach-Object { Write-Host "  [RISK]   $_" }; $bad = $true } else { Write-Host "  [OK] none" }

  Write-Host "`n--- 1c. .gitignore coverage of common sensitive patterns ---"
  $gi = if (Test-Path .gitignore) { Get-Content .gitignore -Raw } else { '' }
  foreach ($pat in @('.env','*.db','credentials/','service_account','*.pem','*.key')) {
    if ($gi.Contains($pat)) { Write-Host "  [OK]   $pat" } else { Write-Host "  [GAP]  $pat - not in .gitignore" }
  }

  Write-Host ""
  if ($bad) {
    Write-Host "RESULT: STOP - alert the user before proceeding to Phase 2."
    Write-Host "  Untrack a leaked file :  git rm --cached <file>   (keeps it on disk)"
    Write-Host "  Then add its pattern to .gitignore. NEVER auto-run these without approval."
  } else { Write-Host "RESULT: clean - proceed to Phase 2." }
}

function Cmd-Format {
  Section "PHASE 2 - AUTO-FORMAT (writes files; touched sides only)"
  if (Touches-Backend)  { Write-Host "backend touched -> npx prettier --write 'src/**/*.{js,jsx,ts,tsx,css}'"; Push-Location $Backend; npx prettier --write 'src/**/*.{js,jsx,ts,tsx,css}'; Pop-Location } else { Write-Host "backend untouched - skipped" }
  if (Touches-Frontend) { Write-Host "frontend touched -> npm run format"; Push-Location $Frontend; npm run format; Pop-Location } else { Write-Host "frontend untouched - skipped" }
}

function Cmd-Precheck {
  Section "PHASE 3 - PRE-CHECK (tests + doc links; read-only)"
  if (Touches-Backend) { npm run test } else { Write-Host "backend untouched - npm run test skipped" }
  if (Touches-Frontend) {
    Push-Location $Frontend; $env:CI = 'true'; npm test -- --watchAll=false; Remove-Item Env:\CI; Pop-Location
  } else { Write-Host "frontend untouched - jest skipped" }
  Write-Host ""
  python scripts/check_doc_links.py
}

function Cmd-Summary {
  Section "PHASE 6 - CHANGE SUMMARY (for atomic commit grouping)"
  git -c core.safecrlf=false status --short
  Write-Host "`n--- diff stat (working tree + staged) ---"
  git -c core.safecrlf=false diff HEAD --stat
  Write-Host "`n--- files grouped by top-level area ---"
  Touched | ForEach-Object { ($_ -split '/')[0..([Math]::Min(1, ($_ -split '/').Count - 1))] -join '/' } | Group-Object | Sort-Object Count -Descending | ForEach-Object { Write-Host ("  {0,4}  {1}" -f $_.Count, $_.Name) }
}

switch ($Cmd) {
  'safety'   { Cmd-Safety }
  'format'   { Cmd-Format }
  'precheck' { Cmd-Precheck }
  'summary'  { Cmd-Summary }
}
