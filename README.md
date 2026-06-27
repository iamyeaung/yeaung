# Ye Aung

A high-performance Knowledge Management System built with Next.js (App Router), Tailwind CSS, and Supabase.

## Prerequisites

- Node.js
- npm

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamyeaung/yeaung.git
   cd yeaung/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Set up your Supabase environment variables in a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   Make sure to fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4. **Serve the Application**
   Run the development server:
   ```bash
   npm run dev
   ```
   Then visit `http://localhost:3000` in your browser.
