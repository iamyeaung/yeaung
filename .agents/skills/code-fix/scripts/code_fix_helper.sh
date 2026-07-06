#!/usr/bin/env bash
# ============================================================================
# /code-fix — Remediation helper
# ----------------------------------------------------------------------------
# Supports the write-only /code-fix workflow with three subcommands:
#
#   findings    (read-only)  Aggregate every UNRESOLVED "- [ ]" item across the
#                            3 analysis report files, grouped by source + count.
#                            Feeds Step 1/2 (Present Merged Priority List).
#
#   checkpoint  (git)        Create a reversible safety point BEFORE fixing, so a
#                            bad fix can be rolled back. Commits nothing to history:
#                            saves a stash snapshot and prints how to restore it.
#
#   format      (write)      Post-fix formatting: npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" (backend) +
#                            npm run format (frontend). Run AFTER fixes are applied.
#
# Usage (from repo root):
#   bash .agents/skills/code-fix/scripts/code_fix_helper.sh findings
#   bash .agents/skills/code-fix/scripts/code_fix_helper.sh checkpoint
#   bash .agents/skills/code-fix/scripts/code_fix_helper.sh format
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BACKEND="$ROOT/frontend"
FRONTEND="$ROOT/frontend"
REPORTS="$ROOT/.agents/reports"
cd "$ROOT"

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }

cmd_findings() {
  section "UNRESOLVED FINDINGS (items still '- [ ]', not [FIXED])"
  local total=0
  for pair in "code-review:code_review_records.md" "qa-tester:qa_tester_records.md" "ui-ux-tester:ui_ux_tester_records.md"; do
    local src="${pair%%:*}" file="$REPORTS/${pair##*:}"
    printf '\n--- /%s (%s) ---\n' "$src" "${pair##*:}"
    if [ ! -f "$file" ]; then echo "  (report file not found — skill not run yet)"; continue; fi
    # Unresolved = a markdown task checkbox that is NOT checked and NOT tagged [FIXED]
    local hits
    hits=$(grep -nE '^\s*- \[ \]' "$file" | grep -viE '\[FIXED' || true)
    if [ -z "$hits" ]; then echo "  ✅ no unresolved items"; continue; fi
    local n; n=$(printf '%s\n' "$hits" | grep -c . )
    printf '%s\n' "$hits" | sed 's/^/  /'
    printf '  → %s unresolved\n' "$n"
    total=$((total + n))
  done
  printf '\nTOTAL UNRESOLVED ACROSS ALL SOURCES: %s\n' "$total"
}

cmd_checkpoint() {
  section "GIT SAFETY CHECKPOINT (before applying fixes)"
  echo "Current branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
  git status --short
  if [ -z "$(git status --porcelain)" ]; then
    echo "  Working tree clean — HEAD ($(git rev-parse --short HEAD)) is already your restore point."
    return 0
  fi
  local stash_msg="code-fix checkpoint $(date +%Y-%m-%d_%H:%M:%S)"
  # snapshot without discarding the working tree (stash create + store keeps files in place)
  local sha; sha=$(git stash create "$stash_msg")
  if [ -n "$sha" ]; then
    git stash store -m "$stash_msg" "$sha"
    echo ""
    echo "  ✅ Snapshot saved to stash (working tree left untouched)."
    echo "     Restore if a fix goes wrong:  git stash apply stash@{0}"
    echo "     List snapshots:               git stash list"
  else
    echo "  (nothing to snapshot)"
  fi
}

cmd_format() {
  section "POST-FIX FORMAT — backend ruff format + frontend npm run format"
  if command -v pipenv >/dev/null 2>&1; then ( cd "$BACKEND" && echo '$ pipenv run npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\"' && pipenv run npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" );
  elif [ -x "$BACKEND/venv/Scripts/python.exe" ]; then ( cd "$BACKEND" && "./venv/Scripts/python.exe" -m npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" );
  else ( cd "$BACKEND" && python -m npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\" ); fi
  ( cd "$FRONTEND" && echo '$ npm run format' && npm run format )
}

case "${1:-}" in
  findings)   cmd_findings ;;
  checkpoint) cmd_checkpoint ;;
  format)     cmd_format ;;
  *) echo "Usage: code_fix_helper.sh <findings|checkpoint|format>"; exit 0 ;;
esac
