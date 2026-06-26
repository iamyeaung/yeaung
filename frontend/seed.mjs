import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase credentials.");
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const logs = [
  {
    title: "Migrated to Next.js 14 Server Actions! 🚀",
    content: "Today I successfully refactored the old API routes to use Next.js 14 Server Actions. The performance boost is incredible, and the code looks much cleaner without all those extra fetch calls. State mutations feel so seamless now!",
    mood: "great",
    tags: ["nextjs", "react", "performance"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Nailed the Tailwind CSS Grid Layout 🎨",
    content: "Spent a few hours perfecting the dashboard layout using Tailwind CSS Grid. Implemented a responsive Bento-box style design that gracefully degrades on mobile. The utility classes made it surprisingly easy to manage complex responsive breakpoints.",
    mood: "great",
    tags: ["tailwindcss", "ui", "design"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Supabase Row Level Security (RLS) Configured 🔒",
    content: "Just locked down our database using Supabase RLS! Wrote some custom Postgres policies to ensure users can only read and write their own daily logs. It took a bit of trial and error to get the SQL policies right, but feeling super secure now.",
    mood: "great",
    tags: ["supabase", "security", "database"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Optimized Database Queries with Supabase ⚡",
    content: "Noticed some slow loading times on the main feed, so I added some indexes to the PostgreSQL tables and optimized our Supabase queries to only select necessary columns. Load time went from 800ms down to 120ms. Huge win!",
    mood: "great",
    tags: ["postgres", "optimization", "supabase"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Built a Custom React Hook for Real-time Subscriptions 🔄",
    content: "Leveraged Supabase's realtime features to build a custom `useRealtimeLogs` React hook. Now our dashboard updates instantly whenever a new log is added, without needing a page refresh. The DX is fantastic!",
    mood: "great",
    tags: ["react", "hooks", "realtime"],
    user_id: "00000000-0000-0000-0000-000000000000"
  }
];

async function seed() {
  console.log("🌱 Seeding daily logs to Supabase...");
  
  for (const log of logs) {
    const { data, error } = await supabase.from("daily_logs").insert(log).select();
    
    if (error) {
      console.error(`❌ Error inserting log: "${log.title}"`, error.message);
    } else {
      console.log(`✅ Successfully inserted: "${log.title}"`);
    }
  }
  
  console.log("🎉 Seeding complete!");
}

seed();
