#!/usr/bin/env bash
# ============================================================================
# /ui-ux-tester — Static UI/UX audit sweep (READ-ONLY, non-destructive)
# ----------------------------------------------------------------------------
# Greps the frontend for the *statically detectable* design-system violations so
# they can be recorded into .agents/reports/ui_ux_tester_records.md. This does NOT
# replace the visual/browser audit (Step 8) — it front-loads the mechanical checks.
#
# Project theme system (the CORRECT way — do not flag these):
#   Tailwind classes backed by CSS vars: bg-main, bg-card, text-main, text-muted,
#   border, primary (#D6001C brand red), blue-*/indigo-* (also mapped to the red brand).
#   darkMode: 'class'  → components should ship `dark:` variants.
#
# Sections:
#   1. Hardcoded colors   : #hex / rgb() / hsl() literals in JS/JSX
#   2. Inline styles      : style={{ ... }} in JSX
#   3. Hardcoded fontSize : inline fontSize: / font-size:
#   4. Clickable <div>    : <div ... onClick> (should be <button>)  [a11y]
#   5. <img> without alt  : images missing an alt attribute        [a11y]
#   6. Dark-mode coverage : how many component files ship `dark:` variants
#
# Usage (from repo root):
#   bash .agents/skills/ui-ux-tester/scripts/run_ui_audit.sh
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SRC="$ROOT/frontend/src"
cd "$ROOT"

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }
# Component sources only (skip tests + generated files); paths printed repo-relative.
INCL=(--include='*.js' --include='*.jsx')
strip() { sed "s#$ROOT/##"; }

section "1. HARDCODED COLORS — #hex / rgb() / hsl() literals (use bg-main/text-main/primary/…)"
grep -rniE '(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -60 \
  || echo "  clean"

section "2. INLINE STYLES — style={{ ... }} (prefer Tailwind classes)"
grep -rniE 'style=\{\{' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -60 \
  || echo "  clean"

section "3. HARDCODED FONT SIZE — inline fontSize / font-size (use text-* classes)"
grep -rniE '(fontSize:|font-size:)' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -40 \
  || echo "  clean"

section "4. CLICKABLE <div> — <div ... onClick> should be a <button>  [a11y HIGH]"
grep -rniE '<div[^>]*onClick' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -40 \
  || echo "  clean — no clickable divs"

section "5. <img> WITHOUT alt — images missing alt attribute  [a11y]"
grep -rniE '<img' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE 'alt=' | grep -viE '/(tests?)/' | strip | head -40 \
  || echo "  clean — every <img> line has alt (verify multi-line tags manually)"

section "6. DARK-MODE COVERAGE — component files shipping dark: variants"
total=$(find "$SRC" \( -name '*.js' -o -name '*.jsx' \) 2>/dev/null | grep -viE '/(tests?)/' | wc -l | tr -d ' ')
withdark=$(grep -rl 'dark:' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | wc -l | tr -d ' ')
printf '  %s of %s component files use `dark:` variants\n' "$withdark" "$total"
echo "  (files with heavy color usage but NO dark: variants are candidates for dark-mode gaps)"

section "UI AUDIT COMPLETE — combine with browser check (Step 8) before recording findings"
