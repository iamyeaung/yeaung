# Git Workflow

This document defines the version control practices and Git workflow for the **yeaung** project. Adherence to this workflow ensures a clean, understandable, and stable codebase.

## 1. Branching Strategy

We use a feature-branch workflow. **Direct commits to the `main` branch are strongly discouraged.**

### Branch Naming Conventions
Always branch off from the latest `main`. Use prefixes to indicate the nature of the branch:
- **`feature/`**: For new features or significant additions (e.g., `feature/add-search-filters`).
- **`fix/`**: For bug fixes (e.g., `fix/header-alignment`).
- **`refactor/`**: For code structure changes without functional changes.
- **`chore/`**: For maintenance, dependency updates, or tool configurations.
- **`docs/`**: For documentation updates.

## 2. Commit Standards

We follow [Semantic Commit Messages](https://gist.github.com/joshbuchea/459088) to keep the Git history readable and automatable.

### Format
```
<type>: <subject>

[optional body]
```

### Types
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries.

*Example:*
`feat: implement Supabase authentication for login page`

## 3. Pull Requests (PR) & Code Review

1. **Keep PRs focused:** A single PR should address a single concern (one feature, one bug).
2. **Self-Review:** Before requesting a review, read through your own diff. Ensure no console.logs, commented-out code, or sensitive data (`.env.local`) are included.
3. **CI/CD Checks:** Ensure that the local checks pass before opening a PR:
   - `npm run lint` completes without errors.
   - Code is formatted properly.
   - Any existing tests (`npm run test`) pass successfully.

## 4. Agent Guidelines

When an AI agent commits code (e.g., via the `safe-commit` skill):
- The agent **must** use the appropriate Semantic Commit prefix.
- The agent **must** confirm that no sensitive environment variables or secrets are being committed.
- The agent should summarize changes clearly in the commit message body if the diff is large.
