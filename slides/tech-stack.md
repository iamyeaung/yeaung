---
marp: true
paginate: true
transition: slide
theme: gaia
_class: lead
color: #fff
background-color: #1e1e2e
---

# The Notebook Tech Stack & Workflow
### Understanding the KMS & Developer Portfolio Architecture
**Developer:** @iamyeaung

---

# Tech Stack

- **Core Framework:** Next.js 16 (App Router)
  - Leverages React Server Components (RSC) for performance and Server Actions for secure database CRUD mutations.
- **Database & Auth:** Supabase (PostgreSQL + Auth)
  - Leverages Row-Level Security (RLS) policies on the logs tables.
- **Styling:** Tailwind CSS (Vanilla Dark/Light theme toggle).
- **Localization:** next-intl
  - Supports English (`en`) and Myanmar (`mm`) localized routes (`/[locale]/...`).

---

# AI Agents

- **Agent File:** `.claude/agents/notebook-builder.md`
- **Purpose:** Expert assistant for Full-Stack developer operations.
- **Responsibilities:**
  - Enforces Next.js App Router patterns.
  - Ensures clean schema models and TypeScript typings.
  - Coordinates database syncs and localized API routing logic.

---

# AI Skills

- **Skill File:** `.claude/skills/laravel-react/SKILL.md`
- **Purpose:** Guides state patterns and UI consistency.
- **Responsibilities:**
  - Standardizes React client-side states, custom hooks, and layout components.
  - Enforces Tailwind class merging conventions and clean modular structure.
  - Maintains strict RESTful-like clean APIs with Supabase.

---

# Dev Methodology

- **Spec-Driven Planning:** Creating/updating specs before coding features.
- **Task Breakdown:** Detailing step-by-step TODO cards.
- **Strict Verification:**
  - Running local compilation checks (`npm run build`).
  - Formatting with Prettier/Linter.
- **Safe Commits:** Atomic semantic commits with verification reports.

---

# Trigger & Command

- **Active Trigger:**
  - Activates at the start of any new feature iteration or localization segment update.
- **Commands:**
  - Start Local Server: `npm run dev`
  - Code Formatting: `npm run format` (Prettier)
  - Compile & Typecheck: `npm run build`
