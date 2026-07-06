#!/usr/bin/env bash
# ============================================================================
# /code-review — Automated static-analysis sweep (READ-ONLY, non-destructive)
# ----------------------------------------------------------------------------
# Gathers the mechanical evidence a reviewer needs so findings can be recorded
# into .agents/reports/code_review_records.md. NEVER modifies source:
#   ruff/prettier run in CHECK mode only; everything else is grep/git/wc.
#
# Sections:
#   1. Changed files + diff stat (review scope)
#   2. Backend lint      : npm run lint  +  ruff format --check app/
#   3. Frontend format   : prettier --check "src/**/*.{js,jsx,css,md}"
#   4. Domain compliance : scan for gambling terminology
#   5. Hardcoded URLs    : backend URL hardcoded in frontend (must use config.js API_URL)
#   6. Hardcoded secrets : obvious secret patterns
#   7. File-size guard   : .py/.js over soft thresholds (300 warn / 500 flag)
#   8. Dependency guard  : diff of package.json / package.json vs the base ref
#
# Usage (from repo root):
#   bash .agents/skills/code-review/scripts/run_review.sh              # vs origin/main
#   bash .agents/skills/code-review/scripts/run_review.sh main         # vs a given base ref
#   bash .agents/skills/code-review/scripts/run_review.sh --working    # uncommitted changes only
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BACKEND="$ROOT/frontend"
FRONTEND="$ROOT/frontend"
cd "$ROOT"

BASE="${1:-origin/main}"
DIFF_RANGE="$BASE...HEAD"
if [ "$BASE" = "--working" ]; then DIFF_RANGE=""; fi

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }
run()     { printf '\n$ %s\n' "$*"; "$@" || printf '\n[exit %s] (non-fatal — recorded as finding)\n' "$?"; }

py_run() {
  if command -v pipenv >/dev/null 2>&1; then ( cd "$BACKEND" && pipenv run "$@" );
  elif [ -x "$BACKEND/venv/Scripts/python.exe" ]; then ( cd "$BACKEND" && "./venv/Scripts/python.exe" -m "$@" );
  elif [ -x "$BACKEND/venv/bin/python" ]; then ( cd "$BACKEND" && "./venv/bin/python" -m "$@" );
  else ( cd "$BACKEND" && python -m "$@" ); fi
}

# ---------------------------------------------------------------------------
section "1. CHANGED FILES + DIFF STAT  (range: ${DIFF_RANGE:-working tree})"
if [ -z "$DIFF_RANGE" ]; then run git diff --stat; else run git diff --stat "$DIFF_RANGE"; fi

# ---------------------------------------------------------------------------
section "2. BACKEND LINT — ruff check + format --check (NO write)"
run npm run lint
run py_run ruff format --check app/

# ---------------------------------------------------------------------------
section "3. FRONTEND FORMAT — prettier --check (NO write)"
( cd "$FRONTEND" && run npx prettier --check "src/**/*.{js,jsx,css,md}" )

# ---------------------------------------------------------------------------
section "4. DOMAIN COMPLIANCE — gambling terminology (must be a statistical tool)"
# Word-boundary, case-insensitive. 'bet' excluded as a bare substring (matches 'between').
run grep -rniE '\b(gamble|gambling|wager|jackpot|casino|payout|stake|win real money|place a bet|bookie|odds of winning)\b' \
  "$BACKEND/app" "$FRONTEND/src" --include='*.py' --include='*.js' --include='*.jsx' \
  || echo "  clean — no gambling terms found"

# ---------------------------------------------------------------------------
section "5. HARDCODED BACKEND URL in frontend (must import API_URL from config.js)"
run grep -rniE '(localhost:8000|127\.0\.0\.1|https?://[^"'"'"' ]*(:8000|/api|/token))' \
  "$FRONTEND/src" --include='*.js' --include='*.jsx' \
  | grep -v 'src/config.js' \
  || echo "  clean — no hardcoded backend URLs outside config.js"

# ---------------------------------------------------------------------------
section "6. HARDCODED SECRETS (obvious patterns)"
run grep -rniE '(secret_key|api_key|password|passwd|token)\s*[:=]\s*["'"'"'][^"'"'"']{6,}' \
  "$BACKEND/app" "$FRONTEND/src" --include='*.py' --include='*.js' --include='*.jsx' \
  | grep -viE '(process\.env|os\.environ|settings\.|getenv|=\s*None|=\s*""|:\s*str)' \
  || echo "  clean — no obvious hardcoded secrets"

# ---------------------------------------------------------------------------
section "7. FILE-SIZE GUARD — soft thresholds 300 (warn) / 500 (flag)"
found_big=0
while IFS= read -r f; do
  [ -f "$f" ] || continue
  n=$(wc -l < "$f" | tr -d ' ')
  if   [ "$n" -gt 500 ]; then printf '  🔴 %5s  %s\n' "$n" "${f#$ROOT/}"; found_big=1
  elif [ "$n" -gt 300 ]; then printf '  🟡 %5s  %s\n' "$n" "${f#$ROOT/}"; found_big=1
  fi
done < <(find "$BACKEND/app" "$FRONTEND/src" \( -name '*.py' -o -name '*.js' -o -name '*.jsx' \) 2>/dev/null)
[ "$found_big" -eq 0 ] && echo "  all files within thresholds"

# ---------------------------------------------------------------------------
section "8. DEPENDENCY GUARD — changes to package.json / package.json"
for dep in frontend/package.json frontend/package.json; do
  if [ -z "$DIFF_RANGE" ]; then d=$(git diff -- "$dep"); else d=$(git diff "$DIFF_RANGE" -- "$dep"); fi
  if [ -n "$d" ]; then printf '\n--- %s changed ---\n%s\n' "$dep" "$d"; else echo "  $dep — unchanged"; fi
done

section "REVIEW SWEEP COMPLETE — record findings into .agents/reports/code_review_records.md"
