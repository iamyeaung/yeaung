---
name: code-review
description: Review code comprehensively against the project's architecture, specs, and rules. Checks static analysis, security, performance, domain compliance, formatting, and dependency management. Read-only (records findings to a file for later fixing).
---

# /code-review — Static Analysis & Architecture Review (Read-Only)

> **Role:** Act as a strict Senior Code Reviewer for the TBWays Tools Full-Stack Web app
> (React 18 + FastAPI). Your job is to **discover and record** code quality issues —
> **NEVER fix code directly.** All findings go to the report file for `/code-fix` to consume.
>
> **Parent Rules:** [AGENTS.md](../../../AGENTS.md) | [agents.md](../../agents.md)
> **Architecture:** [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) | [docs/PROJECT_MAP.md](../../../docs/PROJECT_MAP.md)
> **Guardrails:** [architecture-guardrails/SKILL.md](../architecture-guardrails/SKILL.md)

---

## [STRICT CONSTRAINT: READ-ONLY]

⛔ **DO NOT** modify any source code or configuration files.
✅ **DO** analyze code, run non-modifying checks, and **record all findings** to the report file.

---

## Review Axes

When invoked, perform a comprehensive review of the recent changes or the currently active file using this checklist. Review scope: files specified by the user, or recent `git diff` if not specified.

> **Fastest path — run the bundled sweep script first** to gather all mechanical evidence
> (diff scope, ruff/prettier checks, gambling-term scan, hardcoded-URL/secret scan, file-size
> guard, dependency diff). It is read-only and never aborts on a failing check:
>
> ```bash
> bash .agents/skills/code-review/scripts/run_review.sh              # vs origin/main
> bash .agents/skills/code-review/scripts/run_review.sh main         # vs a given base ref
> bash .agents/skills/code-review/scripts/run_review.sh --working    # uncommitted changes only
> ```
> ```powershell
> powershell -File .agents/skills/code-review/scripts/run_review.ps1    # Windows (primary shell)
> ```
>
> Then read the output section-by-section and apply the judgement-based axes below.

### Axis 1: Spec & Requirements (Does it work?)

1. **Feature Completeness:** Does the code fulfill the requirements?
2. **Edge Cases:** Are nulls, zero division, or large lists handled safely?

### Axis 2: Project Standards (Is it written correctly?)

3. **Architecture check:** Does it violate the responsibility-based modularity rule (soft thresholds: 300/500 lines, single-responsibility per file)? Backend: does it bypass the layered architecture (route → service → repository)? Frontend: is business logic mixed into rendering instead of custom hooks?
4. **Performance check:** Backend — is heavy math done with numpy and offloaded via `async`/`BackgroundTasks` so the main thread never blocks? Frontend — are `useMemo`/`useCallback` used for expensive renders, and are large lists virtualized/paginated?
5. **Domain compliance:** Does the code contain gambling terminology? (Must strictly remain a statistical tool — no "Bet", "Gamble", "Win Real Money").
6. **Security:** Is all input validated with Pydantic? Are protected endpoints guarded with `Depends(protected_route)` (JWT)? No hardcoded secrets — use `.env`.
7. **Error Handling:** Are `try/except` blocks used in routes, returning masked `"Internal Server Error"` instead of `str(e)`? Does the frontend handle axios errors and loading states?
8. **State Management:** Zustand stores for cross-component state; `useState`/`useReducer` for local; custom hooks for complex logic; React Context only for rarely-changing globals. No Redux/MobX/Recoil without permission.
9. **API contract:** Does the frontend use the centralized `API_URL` from `src/config.js` (never a local hardcoded URL)?

### Axis 3: Code Formatting & Dependencies (Is it clean?)

10. **Formatting compliance (non-modifying check):**
    - Backend: run `npm run lint` in `frontend` — record any lint violations
    - Backend: run `ruff format --check app/` — record files that would be reformatted
    - Frontend: run `npx prettier --check "src/**/*.{js,jsx,css,md}"` in `frontend` — record unformatted files
    - **DO NOT run formatting commands that modify files** (`ruff format`, `prettier --write`)

11. **Dependency guard:**
    - Check `package.json` and `package.json` for recently added packages (the script prints the diff)
    - Flag any new npm/PyPI packages that were NOT explicitly approved by the user
    - Verify the package is necessary (can the same be done with existing deps):
      - Frontend runtime: `react`, `react-dom`, `react-router-dom`, `zustand`, `axios`, `@dnd-kit/*`, `react-select`, `react-colorful`, `react-icons`, `@heroicons/react`, `html2canvas`, `ajv`
      - Frontend dev/build: `tailwindcss` + `postcss` + `autoprefixer`, `prettier`, `playwright`, `@testing-library/*`
      - Backend: `fastapi`, `uvicorn`, `numpy`, `pandas`, `pydantic`, `passlib`/`bcrypt`, `python-jose`
    - **DB layer note:** this project uses the **stdlib `sqlite3`** module directly (no ORM). There is
      **no `sqlalchemy`** — a PR that adds SQLAlchemy/any ORM is a new dependency and must be flagged.

---

## Step 1: Analyze & Categorize

Categorize all found issues into:

### 🔴 High Priority (ဦးစားပေး — အမြန်ပြင်သင့်တဲ့ကုဒ်)
- App crashes, major rule violations (e.g., multi-responsibility files >500 lines, gambling terms, wrong state management)
- Security issues (missing auth, exposed secrets, unvalidated input)
- Layer violations (SQL in routes, business logic in UI components)
- Unapproved dependency additions

### 🟡 Normal Priority (ပုံမှန် — မပြင်သေးလဲဖြစ်တဲ့ကုဒ်)
- Missing tests, minor performance improvements
- Formatting violations
- Small refactoring opportunities
- Documentation gaps

---

## Step 2: Record Findings

Write the categorized findings directly into [`../../reports/code_review_records.md`](../../reports/code_review_records.md) — **create the file if it does not exist yet** (append new dated sections on later runs).

```markdown
## YYYY-MM-DD — Code Review

### 🔴 High Priority
- [ ] **[AREA]** `file/path.ext:L##` — Description of the issue
  - Evidence: code snippet or command output

### 🟡 Normal Priority
- [ ] **[AREA]** `file/path.ext` — Description of the issue
  - Suggestion: recommended fix approach
```

---

## Step 3: Report Summary

Provide a **bilingual summary** (English + Burmese):
- Total findings count (High / Normal)
- Worst offending files/areas
- Formatting compliance status
- Dependency audit result
- Instruct the user to run `/code-fix` when ready to remediate

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က project ရဲ့ code quality ကို static analysis နည်းနဲ့ စစ်ဆေးပေးပါတယ်။ Architecture, security, performance, domain compliance, error handling, formatting, dependency management — အကုန်စစ်ပြီး findings ကို `.agents/reports/code_review_records.md` ထဲ High/Normal Priority ခွဲပြီး record ထားပေးပါတယ်။ Code ကို ကိုယ်တိုင် **မပြင်ပါ** — ပြင်ဖို့ `/code-fix` ကို ခေါ်ပါ။*
