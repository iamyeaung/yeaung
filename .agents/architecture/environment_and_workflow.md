# Environment & Workflow

This document outlines the local development environment setup and the standard workflow for the **yeaung** project (Next.js App Router + Supabase).

## 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git**

## 2. Local Setup
All active development happens within the `frontend/` directory.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   *Required variables:*
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Development Workflow

### Running the Development Server
To start the local development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Code Quality (Linting & Formatting)
Before committing code, ensure it adheres to the project's formatting and linting rules.

- **Check for lint errors:**
  ```bash
  npm run lint
  ```
- **Format code using Prettier:**
  ```bash
  npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"
  ```
  *(Note: A dedicated `npm run format` script should be used if defined in `package.json`)*

### Database Workflow (Supabase)
This project uses Supabase for its backend database. 
- **Schema Changes:** Database schema updates, RLS (Row Level Security) policies, and migrations should be managed via the Supabase Dashboard or the Supabase CLI.
- **Type Generation:** Whenever the database schema is updated, ensure that TypeScript types are regenerated to keep the frontend types in sync with the database.

## 4. Agent Guidelines
When an AI agent operates in this environment:
- Always run commands from the `frontend/` directory.
- Never expose the Supabase `SERVICE_ROLE_KEY` to the client-side code.
- Prefer standard `npm` commands for dependency management.
