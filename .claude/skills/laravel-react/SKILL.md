---
name: nextjs-supabase-monolith
description: Best practices for writing Next.js Server Components and using Supabase SDK for data fetching in the DevPulse project. Use when adding features, components, or database schema.
---

# Next.js + Supabase Monolith Best Practices for DevPulse

You are building **DevPulse**, a developer tooling/monitoring dashboard. The stack is a **Next.js App Router Monolith** with **Supabase (PostgreSQL + Auth)**. Follow these practices when writing any code.

---

## 1. Project Structure

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router pages
│   ├── components/
│   │   ├── ui/                  # Primitive UI (buttons, inputs, modals)
│   │   ├── layout/              # Shell, sidebar, header, page wrappers
│   │   └── features/            # Domain components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities, API client (Supabase), constants
│   ├── types/                   # TypeScript type definitions
│   └── stores/                  # Zustand or context state
├── supabase/
│   └── migrations/              # Supabase PostgreSQL migration scripts
├── public/
└── tests/
```

---

## 2. Next.js Monolith Best Practices

### App Router Conventions

Use Next.js App Router with **Server Components by default**. Only add `'use client'` when you need interactivity (state, effects, browser APIs).

### Data Fetching Pattern

Centralize API calls in `lib/api.ts` using `@supabase/supabase-js`. 

- **Queries**: Map Supabase snake_case responses to frontend camelCase TypeScript types.
- **Mutations**: Perform inserts/updates directly via the SDK.

### Server Components vs Client Components

Use Server Components to fetch data directly where possible, or use the centralized API layer. Pass data down to Client Components as props.

### Supabase Migrations

Always write plain `.sql` migrations in `supabase/migrations/` when altering schema. Never use Laravel artisan migrations.

- Use UUIDs for primary keys: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- Use Postgres standard types: `timestamptz`, `text`, `text[]`.
- Always enable Row Level Security (RLS) and define policies.

### Component Patterns

**Composition over configuration.** Build small, focused components and compose them. Avoid giant components with many props controlling behavior.

### TypeScript Types

Define interfaces for all database entities in camelCase. Map them faithfully when reading from Supabase.

### Styling

Use **Tailwind CSS** with consistent spacing and color tokens. Follow mobile-first responsive design.

### Error & Loading States

Every async component must handle loading, error, and empty states. Use React Suspense boundaries for server components.

---

## 3. What to Avoid

- **Never** try to add an external backend service (like Laravel).
- **Never** put secrets in frontend code — use environment variables prefixed with `NEXT_PUBLIC_` only for public values, keeping Supabase service keys entirely out of the client.
- **Never** use `useEffect` for basic data fetching if Server Components or TanStack Query would suffice.
- **Never** skip adding RLS policies in your SQL migrations.
