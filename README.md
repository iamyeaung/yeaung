# 📘 Yeaung Daily Log

A high-performance developer daily log and Knowledge Management System built with Next.js (App Router), Tailwind CSS, and Supabase.

## Status

| Layer                    | Status      |
| ------------------------ | ----------- |
| Frontend (Public Facing) | ✅ Complete |
| Admin Dashboard          | ✅ Complete |
| Backend & Database       | ✅ Complete |
| Internationalization     | ✅ Complete |

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Frontend       | Next.js 16 (App Router) + Tailwind CSS       |
| Backend & Auth | Supabase                                     |
| Database       | PostgreSQL (via Supabase)                    |
| i18n           | next-intl (English & Myanmar `my-MM`)        |
| Icons          | Lucide React                                 |
| Deployment     | Vercel                                       |
| Analytics      | Plausible Analytics                          |
| AI Assistance  | Custom Agent Skills (`.agents`, `.claude`)   |

## Project Structure

```text
yeaung/
├── frontend/                   # Next.js Application Root
│   ├── messages/               # i18n translation dictionaries (en.json, mm.json)
│   └── src/
│       ├── app/                # App Router pages (public, admin, locale routes)
│       ├── components/         # UI Components (admin, features, shared layouts)
│       ├── i18n/               # next-intl configuration and routing
│       ├── lib/                # Supabase client instances & utilities
│       └── types/              # TypeScript interfaces (e.g., DailyLog)
├── screenshots/                # Project gallery and UI screenshots
├── slides/                     # Presentation slides (tech-stack.md)
├── feedback/                   # Project feedback and issue tracking
├── .agents/                    # Custom agent instructions and memory
├── .claude/                    # Claude Code configuration and agents
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase Account and Project

### Local Development

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
   Create a `.env.local` file in the `frontend` directory by copying the example file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Serve the Application**
   Start the Next.js development server (using Turbopack for faster builds):
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Features

- ✅ **Responsive Design**: Mobile-first layouts optimized for all screens.
- ✅ **Bilingual Support**: Full English and Myanmar (Burmese) localization with dynamic routing.
- ✅ **Dark/Light Mode**: Next-themes integration with system preference detection and manual toggle.
- ✅ **Admin Dashboard**: Secure Supabase authentication with a dedicated management interface.
- ✅ **Markdown Editor**: Integrated Markdown formatting toolbar for easy log creation.
- ✅ **Client-side Search**: Real-time reactive keyword search and dynamic pagination.

## License

This project is licensed under the [MIT License](LICENSE).
