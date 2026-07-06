---
name: qa-tester
description: Functional QA tester — runs tests, analyzes failures, audits edge cases, validates API contracts, and records all findings to a report file for later fixing. Read-only (never modifies source code).
---

# /qa-tester — Functional Quality Assurance (Read-Only)

> **Role:** Act as a strict QA Test Engineer for the TBWays Tools Full-Stack Web app
> (React 18 + FastAPI). Your job is to **discover and record** functional quality issues —
> **NEVER fix code directly.** All findings go to the report file for `/code-fix` to consume.
>
> **Parent Rules:** [AGENTS.md](../../../AGENTS.md) | [agents.md](../../agents.md)
> **Architecture:** [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) | [docs/PROJECT_MAP.md](../../../docs/PROJECT_MAP.md)
> **Testing Rules:** [testing_rules.md](../../rules/core_and_standards/testing_rules.md)

---

## [STRICT CONSTRAINT: READ-ONLY]

⛔ **DO NOT** modify any source code, fix bugs, or write new code.
✅ **DO** run tests, analyze output, audit code paths, and **record all findings** to the report file.

---

## Step 1: Run Existing Test Suites

**Fastest path — run the bundled sweep script** (captures backend + frontend in one go, read-only):

```bash
# Cross-platform (Bash tool / Git Bash / macOS / Linux):
bash .agents/skills/qa-tester/scripts/run_qa.sh            # full sweep
bash .agents/skills/qa-tester/scripts/run_qa.sh backend    # backend only
bash .agents/skills/qa-tester/scripts/run_qa.sh frontend   # frontend only
```

```powershell
# Windows PowerShell (this project's primary shell):
powershell -File .agents/skills/qa-tester/scripts/run_qa.ps1
```

The script runs everything below in non-destructive mode and never aborts on a failing
suite (failures are read from its output). If you prefer to run steps manually:

### Backend Tests
- Navigate to `frontend`
- Run `npm run test` (falls back to `venv/Scripts/python.exe -m npm run test`)
- Capture ALL output (pass count, fail count, error details, collection errors)
- ⚠️ Legacy `__tests__/yeaung.test.ts` imports `lib/yeaung/result.ts` and executes at
  import time (touches a GCS bucket) — expect a collection/network error and record it.

### Frontend Tests
- Navigate to `frontend`
- This is a **Create React App / Jest** project (npm, not bun). Run a **single non-interactive** pass:
  - `CI=true npm test -- --coverage --watchAll=false` (Bash)
  - `$env:CI='true'; npm test -- --coverage --watchAll=false` (PowerShell)
- ⚠️ A bare `npm test` opens **watch mode and hangs** — always pass `--watchAll=false`.
- Capture pass/fail counts **and** the coverage table (feeds Step 2's gap analysis).

### Auto-Formatting / Lint Check (non-modifying)
- Backend: `npm run lint` (lint check only, NOT `ruff format`)
- Frontend: `npx prettier --check "src/**/*.{js,jsx,css,md}"` (check only, NOT `--write`)
- Record any violations as Normal Priority findings

> **If test suites fail to collect/run** (e.g., import errors, missing dependencies),
> record the infrastructure issue as High Priority and continue with the remaining steps.

---

## Step 2: Test Coverage Gap Analysis

Read the **coverage table** printed by Step 1's frontend run (`--coverage`) to find files at
0% / low coverage first, then scan the codebase for **untested logic**:

### Backend (`frontend/src/app/`)
| Area | What to check |
|---|---|
| Services | `yeaung_service.ts`, `pattern_service.ts`, `binary_model_service.ts` — do corresponding tests exist in `tests/`? |
| Routes | Each route in `app/api/routes/` — are critical endpoints tested? |
| Math/Probability | Any calculation functions — are known-input/known-output tests present? |
| Repositories | DB access functions — are they tested with mocked sessions? |

### Frontend (`frontend/src/`)
| Area | What to check |
|---|---|
| Custom Hooks | `useYeaungActions.js`, `useEditorStore.js`, search hooks — tested? |
| Complex Components | `YeaungSidebar.js`, `BinaryModelManager.js`, editor canvas — tested? |
| Utility Functions | `utils/` — pure functions tested? |

Record each untested area as a **Normal Priority** finding with the file path and what should be tested.

---

## Step 3: Edge Case Audit

Review the active codebase for these specific vulnerability patterns:

| Pattern | Where to look | Example |
|---|---|---|
| **Null/Undefined** | API response handlers, optional chaining, default values | `data.results` without `data?.results` |
| **Zero Division** | Math calculations in services | Percentage calculations with possible 0 denominator |
| **Empty Arrays** | List rendering, `.map()`, `.reduce()`, `.length` checks | `yeaungs.map(...)` without empty check |
| **Massive Data** | Unvirtualized lists, unbounded queries | `SELECT *` without `LIMIT`, rendering 10k+ rows |
| **Timeout/Network** | Polling loops, axios calls without timeout | `setTimeout(pollStatus, 3000)` without max retries |
| **Type Coercion** | String/Number mixing in comparisons | `if (count == "0")` vs `if (count === 0)` |
| **Concurrent State** | Race conditions in async hooks | Multiple rapid clicks triggering parallel API calls |

---

## Step 4: API Contract Validation

Compare **frontend axios calls** vs **backend route signatures + Pydantic schemas**:

1. Read `frontend/src/api.js` (or wherever axios instances are configured)
2. For each API call, verify:
   - URL path matches a defined route in `app/api/routes/`
   - Request body shape matches the Pydantic `Request` schema
   - Response handling matches the Pydantic `Response` schema
   - Error status codes are handled (401, 403, 404, 422, 500)
3. Record mismatches as **High Priority** findings

---

## Step 5: E2E Scenario Check (Browser — Requires Permission)

> ⚠️ **BEFORE launching any browser instance**, you MUST ask the user for explicit permission.
> If denied, skip this step entirely and note it in the report.

If permitted, test these critical user flows:

| Flow | Steps to verify |
|---|---|
| **Yeaung Update** | Navigate to `/yeaung-update` → select a yeaung → trigger update → verify loading → verify completion |
| **Search** | Navigate to search page → enter a query → verify results render → verify pagination |
| **Editor** | Open editor → add/move/delete items → verify canvas interactions → verify save |
| **Auth** | Login → verify token → access protected page → logout → verify redirect |

Record any console errors, broken interactions, or unexpected behavior as findings.

---

## Step 6: Categorize & Record Findings

Categorize ALL discovered issues into:

### 🔴 High Priority (ဦးစားပေး — အမြန်ပြင်သင့်)
- Test suite infrastructure failures (can't run tests at all)
- API contract mismatches (frontend expects different shape than backend provides)
- Missing null/error handling that causes runtime crashes
- Security-adjacent issues (unhandled auth errors, exposed data)

### 🟡 Normal Priority (ပုံမှန် — မပြင်သေးလဲ ဖြစ်)
- Missing test coverage for specific functions/hooks
- Edge case handling improvements
- Formatting/lint violations
- Performance optimization opportunities

### Record Format

Write findings to [`../../reports/qa_tester_records.md`](../../reports/qa_tester_records.md) — **create the file if it does not exist yet** (append new dated sections on later runs):

```markdown
## YYYY-MM-DD — QA Tester Run

### 🔴 High Priority
- [ ] **[AREA]** `file/path.ext:L##` — Description of the issue
  - Evidence: test output / code snippet showing the problem

### 🟡 Normal Priority
- [ ] **[AREA]** `file/path.ext` — Description of the issue
  - Suggestion: what test/fix is recommended
```

---

## Step 7: Report Summary

Provide a **bilingual summary** (English + Burmese):
- Total findings count (High / Normal per category)
- Test suite status (pass/fail/broken)
- Coverage gaps identified
- Instruct the user to run `/code-fix` when ready to remediate

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က project ရဲ့ functional quality ကို စစ်ဆေးပေးတဲ့ QA tester ဖြစ်ပါတယ်။ Test suite တွေ run ပြီး failure analyze လုပ်၊ test coverage gap ရှာ၊ edge case audit လုပ်၊ API contract စစ်ဆေး — ဒါပေမယ့် code ကို ကိုယ်တိုင် **မပြင်ပါ**။ တွေ့ရှိချက်အားလုံးကို `.agents/reports/qa_tester_records.md` ထဲ High/Normal Priority ခွဲပြီး record ထားပေးပါတယ်။ ပြင်ဖို့ `/code-fix` ကို ခေါ်ပါ။*
