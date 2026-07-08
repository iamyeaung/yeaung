# Running Context Memory (Project: Yeaung)

> **Goal:** High-performance Knowledge Management System built with Next.js (App Router), Tailwind CSS, and Supabase.

## Current Focus
Fixed Vercel deployment issues by resolving ESLint peer dependency conflicts and guiding the user through Vercel Dashboard configurations (Root Directory, Framework Preset, and Supabase Environment Variables).

## Log

- **2026-07-08**: Implemented multi-language support (en, mm) using next-intl and dynamic locale database filtering.
  - **Changed:** Refactored routing folder structure to `/[locale]/` dynamic segments. Configured `next-intl` configuration and added translations directories. Merged dynamic language router with Supabase authorization checker in `proxy.ts` middleware. Modified SQL migration mapping, schemas, and queries to filter and insert logs tagged with the target language. Created LanguageSwitcher button and integrated it into the header navbar.
  - **Why:** To enable seamless localization toggling between English and Myanmar languages, supporting both static layout text and dynamic posts filtering.
  - **Gotchas:** Make sure to run the migration query (`ALTER TABLE daily_logs ADD COLUMN locale text NOT NULL DEFAULT 'en';`) in the remote Supabase Dashboard to prevent insertion or select check errors.
  - **Open threads:** None.

- **2026-07-06**: Fixed Vercel deployment and peer dependency issues.
  - **Changed:** Upgraded `eslint` to `^9.0.0` in `frontend/package.json` to resolve conflicts with `eslint-config-next@16.2.9`. Guided user to configure Vercel settings correctly (Root Directory: `frontend`, Framework Preset: `Next.js`, and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - **Why:** `npm install` was failing on Vercel due to ERESOLVE peer dependency issues, and the deployed app had 404/500 errors due to missing Framework Preset and missing Supabase environment variables.
  - **Gotchas:** When changing Next.js versions, ensure `eslint` is upgraded to the expected major version (e.g. v9). Also, Vercel needs manual environment variables mapping from `.env.local`.
  - **Open threads:** None.

- **2026-07-06**: Populated `.agents/architecture` documentation.
  - **Changed:** Filled `environment_and_workflow.md`, `git_workflow.md`, `mcp_setup.md`, and `project_mapping.md` with detailed guidelines specific to the Next.js App Router and Supabase stack.
  - **Why:** The architecture files were empty/legacy from a previous project and needed to be updated to match the current project.
  - **Gotchas:** None.
  - **Open threads:** None.

- **2026-07-06**: Adapted `.agents/skills` to Next.js + Supabase.
  - **Changed:** Rewrote paths, scripts (`run_qa`, `run_review`, `safe_commit_check`), and `architecture-guardrails/SKILL.md`. Swapped Python (`ruff`, `pytest`) for Node (`npm run lint`, `prettier`, `test`). Removed `combo_generate` paths.
  - **Why:** The skills folder was copied from an old project (Python/React) and was incompatible with the current Next.js structure.
  - **Gotchas:** Scripts were rewritten programmatically to only target `frontend` instead of `backend`/`frontend`.
  - **Open threads:** None.

