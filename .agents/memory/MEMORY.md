# Running Context Memory (Project: Yeaung)

> **Goal:** High-performance Knowledge Management System built with Next.js (App Router), Tailwind CSS, and Supabase.

## Current Focus
Completed Chapter 6 polish and feature completion (bilingual redirect preservation, markdown toolbar helper, and client-side landing search).

## Log

- **2026-07-09**: Renamed internal system codename from "DevPulse" to "The Notebook".
  - **Changed:** Renamed references in `package.json`, `slides/pitch.md`, `slides/tech-stack.md`, and `feedback/feedback.md`. Renamed agent file from `devpulse-builder.md` to `notebook-builder.md`.
  - **Why:** To maintain consistency across the system name and project name after rebranding to a general knowledge management focus.
  - **Gotchas:** None.
  - **Open threads:** None.

- **2026-07-09**: Renamed project brand from "Daily Log" to "The Notebook".
  - **Changed:** Replaced text occurrences of "Daily Log" with "The Notebook" (and "နေ့စဉ်မှတ်တမ်းများ" with "မှတ်စုများ" in `mm.json`) across `README.md`, layouts, components, and translations.
  - **Why:** The user requested a name that better suits a general knowledge sharing project.
  - **Gotchas:** None.
  - **Open threads:** None.

- **2026-07-09**: Rewrote project README.md for gallery display.
  - **Changed:** Created a comprehensive README.md including project status, tech stack, structure, and getting started instructions.
  - **Why:** To document the project structure and setup instructions clearly, fulfilling the user's request based on a provided template.
  - **Gotchas:** None.
  - **Open threads:** None.

- **2026-07-09**: Completed Chapter 6 features and UI polish requirements.
  - **Changed:** Fixed login/logout redirects by passing locale parameter to Server Actions; added LanguageSwitcher in admin dashboard layout header; localized admin dashboard overview, posts, and categories views in `en.json`/`mm.json`; added Markdown formatting toolbar above `daily-log-form.tsx` textarea; implemented client-side search and pagination using a new `LogFeedClient` component.
  - **Why:** To solve user feedback issues, enable localized admin panel control, improve markdown editor UX, and support instant logs search.
  - **Gotchas:** Pass the locale parameter inside form inputs to Server Actions to ensure redirect targets preserve the user's selected language.
  - **Open threads:** None.

- **2026-07-08**: Completed Chapter 4 and Chapter 5 homework deliverables.
  - **Changed:** Added MIT `LICENSE` and project `screenshots/` (landing, dashboard, login) in project repo. Created `slides/tech-stack.md` and `feedback/feedback.md` in project repo. Generated, committed, and pushed `ch-4/iamyeaung/report.md` and `ch-5/iamyeaung/report.md` in `team-10` repo. Fixed empty/missing proposals (`iamyeaung.md` and `@alexjoker5`) in `team-10` repo to make CI build green.
  - **Why:** To satisfy course homework requirements and clear team-10 repository assignment verification blocks.
  - **Gotchas:** `doctor.sh` checks the remote GitHub default branch for the report.md files, so branches must be pushed/merged for remote checks to pass. Host Git Bash should be used if WSL lacks Node/Claude binary PATHs.
  - **Open threads:** None.

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

