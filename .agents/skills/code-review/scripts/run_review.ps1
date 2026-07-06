# ============================================================================
# /code-review - Automated static-analysis sweep (READ-ONLY)  [Windows PS 5.1]
# ----------------------------------------------------------------------------
# PowerShell equivalent of run_review.sh. NEVER modifies source (ruff/prettier
# run in CHECK mode only; everything else is Select-String / git / line counts).
#
# Usage (from repo root):
#   powershell -File .agents/skills/code-review/scripts/run_review.ps1              # vs origin/main
#   powershell -File .agents/skills/code-review/scripts/run_review.ps1 main         # vs a base ref
#   powershell -File .agents/skills/code-review/scripts/run_review.ps1 --working    # uncommitted only
# ============================================================================
param([string]$Base = 'origin/main')

$ErrorActionPreference = 'Continue'
$Root     = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
$Backend  = Join-Path $Root 'frontend'
$Frontend = Join-Path $Root 'frontend'
Set-Location $Root

$Range = "$Base...HEAD"
$Working = ($Base -eq '--working')

function Section($t) { Write-Host "`n============================================================"; Write-Host "== $t"; Write-Host "============================================================" }
function Py-Run { if (Get-Command pipenv -ErrorAction SilentlyContinue) { Push-Location $Backend; pipenv run @args; Pop-Location } elseif (Test-Path "$Backend\venv\Scripts\python.exe") { Push-Location $Backend; & ".\venv\Scripts\python.exe" -m @args; Pop-Location } else { Push-Location $Backend; python -m @args; Pop-Location } }
function Scan($paths, $pattern, $cleanMsg) {
  $files = Get-ChildItem -Path $paths -Recurse -Include *.py,*.js,*.jsx -File -ErrorAction SilentlyContinue
  $hits = $files | Select-String -Pattern $pattern -AllMatches -ErrorAction SilentlyContinue
  if ($hits) { $hits | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } } else { Write-Host "  $cleanMsg" }
}

Section "1. CHANGED FILES + DIFF STAT"
if ($Working) { git diff --stat } else { git diff --stat $Range }

Section "2. BACKEND LINT - ruff check + format --check (NO write)"
npm run lint
Py-Run ruff format --check app/

Section "3. FRONTEND FORMAT - prettier --check (NO write)"
Push-Location $Frontend; npx prettier --check "src/**/*.{js,jsx,css,md}"; Pop-Location

Section "4. DOMAIN COMPLIANCE - gambling terminology"
Scan @("$Backend\app","$Frontend\src") '\b(gamble|gambling|wager|jackpot|casino|payout|stake|win real money|place a bet|bookie|odds of winning)\b' 'clean - no gambling terms found'

Section "5. HARDCODED BACKEND URL in frontend (must use config.js API_URL)"
$u = Get-ChildItem "$Frontend\src" -Recurse -Include *.js,*.jsx -File -ErrorAction SilentlyContinue | Select-String -Pattern '(localhost:8000|127\.0\.0\.1|https?://[^"'' ]*(:8000|/api|/token))' -ErrorAction SilentlyContinue | Where-Object { $_.Path -notmatch 'config\.js' }
if ($u) { $u | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } } else { Write-Host "  clean - no hardcoded backend URLs outside config.js" }

Section "6. HARDCODED SECRETS (obvious patterns)"
$s = Get-ChildItem @("$Backend\app","$Frontend\src") -Recurse -Include *.py,*.js,*.jsx -File -ErrorAction SilentlyContinue | Select-String -Pattern '(secret_key|api_key|password|passwd|token)\s*[:=]\s*["''][^"'']{6,}' -ErrorAction SilentlyContinue | Where-Object { $_.Line -notmatch '(process\.env|os\.environ|settings\.|getenv)' }
if ($s) { $s | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } } else { Write-Host "  clean - no obvious hardcoded secrets" }

Section "7. FILE-SIZE GUARD - soft thresholds 300 (warn) / 500 (flag)"
$big = $false
Get-ChildItem @("$Backend\app","$Frontend\src") -Recurse -Include *.py,*.js,*.jsx -File -ErrorAction SilentlyContinue | ForEach-Object {
  $n = (Get-Content $_.FullName | Measure-Object -Line).Lines
  if ($n -gt 500) { Write-Host ("  [FLAG] {0,5}  {1}" -f $n, $_.FullName.Replace("$Root\",'')); $big = $true }
  elseif ($n -gt 300) { Write-Host ("  [warn] {0,5}  {1}" -f $n, $_.FullName.Replace("$Root\",'')); $big = $true }
}
if (-not $big) { Write-Host "  all files within thresholds" }

Section "8. DEPENDENCY GUARD - package.json / package.json changes"
foreach ($dep in @('frontend/package.json','frontend/package.json')) {
  if ($Working) { $d = git diff -- $dep } else { $d = git diff $Range -- $dep }
  if ($d) { Write-Host "`n--- $dep changed ---"; $d } else { Write-Host "  $dep - unchanged" }
}

Section "REVIEW SWEEP COMPLETE - record findings into .agents/reports/code_review_records.md"
