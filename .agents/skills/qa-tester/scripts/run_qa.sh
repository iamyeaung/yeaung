#!/usr/bin/env bash
# ============================================================================
# /qa-tester — Automated test sweep (READ-ONLY, non-destructive)
# ----------------------------------------------------------------------------
# Runs the full functional QA sweep for the TBWays Tools full-stack app:
#   1. Backend  : npm run test + ruff lint check
#   2. Frontend : Jest (one-shot, with coverage) + prettier check
#
# NEVER writes/formats source. `ruff` and `prettier` run in CHECK mode only.
# Captures all output so /qa-tester can record findings. Exit code is always 0
# so a failing suite does not abort the sweep — failures are read from output.
#
# Usage (from repo root):
#   bash .agents/skills/qa-tester/scripts/run_qa.sh            # full sweep
#   bash .agents/skills/qa-tester/scripts/run_qa.sh backend    # backend only
#   bash .agents/skills/qa-tester/scripts/run_qa.sh frontend   # frontend only
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BACKEND="$ROOT/frontend"
FRONTEND="$ROOT/frontend"
TARGET="${1:-all}"

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }
run()     { printf '\n$ %s\n' "$*"; "$@" || printf '\n[exit code: %s] (non-fatal — recorded as finding)\n' "$?"; }

# --- pick backend python runner (pipenv preferred, then local venv) ----------
py_run() {
  if command -v pipenv >/dev/null 2>&1; then pipenv run "$@";
  elif [ -x "$BACKEND/venv/Scripts/python.exe" ]; then "$BACKEND/venv/Scripts/python.exe" -m "$@";
  elif [ -x "$BACKEND/venv/bin/python" ]; then "$BACKEND/venv/bin/python" -m "$@";
  else python -m "$@"; fi
}

qa_backend() {
  section "BACKEND — npm run test"
  ( cd "$BACKEND" && run npm run test )

  section "BACKEND — ruff lint check (NO auto-fix)"
  ( cd "$BACKEND" && run npm run lint )
}

qa_frontend() {
  section "FRONTEND — Jest (one-shot + coverage)"
  # CI=true + --watchAll=false => single non-interactive run (CRA/react-scripts).
  ( cd "$FRONTEND" && CI=true run npm test -- --coverage --watchAll=false )

  section "FRONTEND — prettier check (NO auto-format)"
  ( cd "$FRONTEND" && run npx prettier --check "src/**/*.{js,jsx,css,md}" )
}

section "QA SWEEP START — target: $TARGET — root: $ROOT"
case "$TARGET" in
  backend)  qa_backend ;;
  frontend) qa_frontend ;;
  all)      qa_backend; qa_frontend ;;
  *) echo "Unknown target '$TARGET' (use: all | backend | frontend)"; exit 0 ;;
esac
section "QA SWEEP COMPLETE — review output above and record findings"
