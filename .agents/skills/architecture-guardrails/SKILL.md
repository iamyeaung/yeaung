---
name: architecture-guardrails
description: Senior Code Quality Architect, Performance Engineer, QA Test Enforcer, and Policy Compliance Officer for this project's Next.js (App Router) and Supabase architecture rules.
---

# 🏗️ AI Skill File: Architecture Guardrails & Coding Quality Enforcement

> **Skill Profile ID:** `architecture_guardrails_skill`
> **Version:** 2.0.0 | **Rewritten for the Next.js/Supabase Web stack:** 2026-07-06
> **Parent Rules:** [agents.md](../../agents.md) | **Architecture:** [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) | **Map:** [docs/PROJECT_MAP.md](../../../docs/PROJECT_MAP.md)

---

## [SKILL OBJECTIVE]

Act as a **Strict Senior Code Quality Architect, Performance Engineer, QA Test Enforcer, and Policy Compliance Officer** for the Ye Aung Knowledge Management System (Next.js App Router + Supabase). Enforce, validate, and maintain the architectural guardrails, coding standards, state management patterns, modularity rules, and domain-policy compliance across EVERY module and file.

This skill profile is **cross-cutting** — it applies to ALL other skill domains. Every AI sub-agent working on any module MUST inherit and enforce these constraints without exception.

---

## [TARGET SCOPE & FILES]

**The active application lives in `frontend/`.** Anything at repo root starting with `old_*` is a legacy snapshot — ⛔ READ-ONLY, never edit.

### Architecture (Next.js App Router + Supabase)
| Layer | Path | Rule |
|---|---|---|
| App Router | `frontend/src/app/` | Use Server Components by default. Add `'use client'` only when interactivity is needed. |
| Server Actions | `frontend/src/app/actions/` | Use Server Actions for data mutations. Never expose Supabase service role key to the client. |
| Components | `frontend/src/components/` | Modular UI components (Shadcn UI / Tailwind). |
| Lib/Utils | `frontend/src/lib/` | Shared utilities, Supabase client configuration, Zod schemas. |

Data flow: **Supabase (PostgreSQL) ↔ Server Actions / API Routes ↔ Server/Client Components.**

### Reference Documentation
| Document | Path |
|---|---|
| Master Agent Rules | [.agents/agents.md](../../agents.md) |
| Project Map | [docs/PROJECT_MAP.md](../../../docs/PROJECT_MAP.md) |
| Environment & Workflow | [.agents/architecture/environment_and_workflow.md](../../architecture/environment_and_workflow.md) |

---

## [EXECUTION PROTOCOLS]

### Protocol 1: Responsibility-Based Modularity Enforcement
1. **CHECK** the current line count AND the number of distinct responsibilities before modifying any file.
2. **Soft thresholds:** <300 lines = healthy · 300–500 = review zone · >500 = MUST flag to human.
3. **NEVER auto-split** — always propose and wait for human approval.

### Protocol 2: State Management (Frontend)
- **ALLOWED:** Server Components for fetching data; React hooks (`useState`, `useReducer`) for local interactive state; Zustand or Context for global UI state only when props drilling is too deep.
- **FORBIDDEN:** Unnecessary `'use client'` directives; inline complex business logic in JSX.

### Protocol 3: Styling & Theming
- Use **Tailwind CSS** utility classes / theme tokens. No hardcoded hex colors or ad-hoc inline styles when a Tailwind class exists.
- Reuse shared components (`components/`) before writing new UI.

### Protocol 4: Performance
- **Next.js:** Leverage Next.js caching, Server Components, and static generation where possible.
- **Frontend:** `useMemo` / `useCallback` on expensive computations; keep client-side JS bundle small.

### Protocol 5: Error Handling
- Server Actions should return standardized error objects or use React's `useFormState` conventions.
- Use `error.tsx` and `not-found.tsx` boundaries for routing errors. No silent `catch {}`.

### Protocol 6: Security
- Validate ALL input with Zod schemas.
- Use Supabase RLS (Row Level Security) for database access control.
- Never leak `NEXT_PUBLIC_` variables unless they are safe for the client (like Anon Key). Service Role Keys must NEVER reach the client.

### Protocol 7: Dependency Management
- NEVER introduce new npm packages without explicit permission.

### Protocol 8: Formatting
- Run `npm run format` (Prettier) and `npm run lint` (ESLint) after every change.

---

## [STRICT ENFORCEMENT CHECKLIST]

Use this checklist when reviewing ANY code change:

- [ ] **Layering:** Next.js Server vs Client components respected? Server Actions properly secured?
- [ ] **Modularity:** single responsibility per file?
- [ ] **State:** 'use client' used only where needed?
- [ ] **Styling:** Tailwind theme classes; no hardcoded colors/styles?
- [ ] **Validation:** Zod used for form/API input validation?
- [ ] **Security:** RLS considered? Supabase keys handled properly?
- [ ] **Formatting:** `npm run lint` and `npm run format` run?
- [ ] **Communication:** proposals and debugging explained in Burmese (tech terms in English)?

---

## [META-PROMPTING PROTOCOL]

When a task is too complex for direct code generation, or when explicitly instructed with **"Generate Agent Prompt"**:

1. **STOP** acting as a code generator; **TRANSITION** to "Senior System Architect & Prompt Engineer".
2. **GENERATE** a detailed prompt inside a code block.
3. **EXPLAIN** the architectural reasoning briefly in Burmese first.

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က Next.js (App Router) နဲ့ Supabase architecture စည်းမျဉ်းတွေ (Server Components, Tailwind, Zod validation, formatting) ကို file တိုင်းမှာ တင်းကြပ်စွာ စစ်ဆေး enforce လုပ်ဖို့ပါ။ Checklist အတိုင်း စစ်ပြီး ချိုးဖောက်မှုတွေ့ရင် ချက်ချင်းမပြင်ဘဲ human ကို အရင် တင်ပြပါ။*
