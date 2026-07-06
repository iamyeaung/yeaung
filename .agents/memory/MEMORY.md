# Running Context Memory (Project: Yeaung)

> **Goal:** High-performance Knowledge Management System built with Next.js (App Router), Tailwind CSS, and Supabase.

## Current Focus
Adapted the AI agent skills and scripts from a legacy Python backend stack to the current Next.js (App Router) + Supabase stack.

## Log

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

