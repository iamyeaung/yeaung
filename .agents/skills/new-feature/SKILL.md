---
name: new-feature
description: Proposal-first workflow for adding a feature or non-trivial change. Enforces the Proposal First rule (propose before coding) and the plan -> build -> verify -> save loop.
---

# /new-feature — Proposal-first feature flow

> Enforces **the Proposal-First rule** (AGENTS.md §4 Rule 1): never generate code immediately.

## 1. Plan (no code yet)
- Ensure [`/start`](../start/SKILL.md) context is loaded (rules, architecture, memory).
- Analyze the affected code and produce a **bulleted proposal**:
  - **Must-Have Changes** — exact changes required to make the feature work (Frontend + Backend).
  - **Porting Strategy** — if porting from Flutter: how Dart states/logic map to React Hooks or FastAPI endpoints.
  - **Recommended Changes** — optional refactors for quality / UX / performance.
- For an Implementation Plan, use the **paragraph-level bilingual format** (full English
  paragraph, then the full Myanmar translation in italics) per AGENTS.md §6.
- **Wait for explicit approval** ("Approve all" / "Approve must-haves only") before coding.

## 2. Build (after approval)
- Respect constraints: **responsibility-based modularity** (soft thresholds — never auto-split),
  backend **layered architecture** (route → service → repository, no layer bypass), frontend
  **UI/logic separation** (complex state in custom hooks), Tailwind theme over hardcoded styles.
- Heavy math/DB work must not block the main thread — use **numpy** and FastAPI
  `async`/`BackgroundTasks` (see [`environment_and_workflow.md`](../../architecture/environment_and_workflow.md)).
- Validate input with Pydantic; guard protected endpoints with `Depends(protected_route)`;
  never hardcode secrets or backend URLs (use `.env` / `src/config.js`).
- Code-format rule: small files → full file; large files → `[FIND]` / `[REPLACE WITH]` snippets.

## 3. Verify
- Add/adjust **unit tests**: `npm run test` + `unittest.mock` for new backend logic/math/DB,
  **Jest + React Testing Library** for complex hooks/components.
  Cover null / empty / zero-division / massive-array edge cases.
- Run `npm run test` (backend) and `npm run test` (frontend) locally before declaring done.
- Format: `npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"` (backend) / `npm run format` (frontend).
- Regression check: confirm existing interactive features (editor canvas pan/zoom,
  drag-and-drop, undo/redo) still work if the change touches them.

## 4. Save
- Run [`/save-memory`](../save-memory/SKILL.md): MEMORY.md entry, ADR if a real decision was
  made, update `docs/PROJECT_MAP.md` if structure changed.

---

*Myanmar — အနှစ်ချုပ်:*
*Feature အသစ်တိုင်း — (၁) code မရေးခင် Must-Have / Porting Strategy / Recommended proposal တင်ပြီး approval*
*စောင့်၊ (၂) approve ရမှ constraint တွေ (responsibility-based modularity, layered architecture, custom hooks, Tailwind theme) လိုက်နာ*
*ပြီး ရေး၊ (၃) `npm run test` + `npm run test` နဲ့ verify ပြီး format လုပ်၊ (၄) `/save-memory` နဲ့ ချရေး။*
