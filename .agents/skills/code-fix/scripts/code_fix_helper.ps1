# ============================================================================
# /code-fix - Remediation helper  [Windows PowerShell 5.1]
# ----------------------------------------------------------------------------
# PowerShell equivalent of code_fix_helper.sh.
#   findings    (read-only) Aggregate unresolved "- [ ]" items across 3 reports.
#   checkpoint  (git)       Reversible safety snapshot BEFORE fixing (stash, keeps tree).
#   format      (write)     Post-fix: npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" + npm run format.
#
# Usage (from repo root):
#   powershell -File .agents/skills/code-fix/scripts/code_fix_helper.ps1 findings
#   powershell -File .agents/skills/code-fix/scripts/code_fix_helper.ps1 checkpoint
#   powershell -File .agents/skills/code-fix/scripts/code_fix_helper.ps1 format
# ============================================================================
param([ValidateSet('findings','checkpoint','format')][string]$Cmd = 'findings')

$ErrorActionPreference = 'Continue'
$Root     = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
$Backend  = Join-Path $Root 'frontend'
$Frontend = Join-Path $Root 'frontend'
$Reports  = Join-Path $Root '.agents\reports'
Set-Location $Root

function Section($t) { Write-Host "`n============================================================"; Write-Host "== $t"; Write-Host "============================================================" }

function Cmd-Findings {
  Section "UNRESOLVED FINDINGS (items still '- [ ]', not [FIXED])"
  $total = 0
  $map = @{ 'code-review'='code_review_records.md'; 'qa-tester'='qa_tester_records.md'; 'ui-ux-tester'='ui_ux_tester_records.md' }
  foreach ($src in @('code-review','qa-tester','ui-ux-tester')) {
    $file = Join-Path $Reports $map[$src]
    Write-Host "`n--- /$src ($($map[$src])) ---"
    if (-not (Test-Path $file)) { Write-Host "  (report file not found - skill not run yet)"; continue }
    $hits = Select-String -Path $file -Pattern '^\s*- \[ \]' | Where-Object { $_.Line -notmatch '\[FIXED' }
    if (-not $hits) { Write-Host "  [OK] no unresolved items"; continue }
    $hits | ForEach-Object { Write-Host ("  {0}: {1}" -f $_.LineNumber, $_.Line.Trim()) }
    Write-Host ("  -> {0} unresolved" -f $hits.Count)
    $total += $hits.Count
  }
  Write-Host "`nTOTAL UNRESOLVED ACROSS ALL SOURCES: $total"
}

function Cmd-Checkpoint {
  Section "GIT SAFETY CHECKPOINT (before applying fixes)"
  Write-Host "Current branch: $(git rev-parse --abbrev-ref HEAD)"
  git status --short
  if (-not (git status --porcelain)) { Write-Host "  Working tree clean - HEAD ($(git rev-parse --short HEAD)) is already your restore point."; return }
  $msg = "code-fix checkpoint $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')"
  $sha = (git stash create $msg)
  if ($sha) {
    git stash store -m $msg $sha
    Write-Host "`n  [OK] Snapshot saved to stash (working tree left untouched)."
    Write-Host "     Restore if a fix goes wrong:  git stash apply stash@{0}"
    Write-Host "     List snapshots:               git stash list"
  } else { Write-Host "  (nothing to snapshot)" }
}

function Cmd-Format {
  Section "POST-FIX FORMAT - backend ruff format + frontend npm run format"
  Push-Location $Backend
  if (Get-Command pipenv -ErrorAction SilentlyContinue) { pipenv run npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" }
  elseif (Test-Path "$Backend\venv\Scripts\python.exe") { & ".\venv\Scripts\python.exe" -m npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" }
  else { python -m npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" }
  Pop-Location
  Push-Location $Frontend; npm run format; Pop-Location
}

switch ($Cmd) {
  'findings'   { Cmd-Findings }
  'checkpoint' { Cmd-Checkpoint }
  'format'     { Cmd-Format }
}
