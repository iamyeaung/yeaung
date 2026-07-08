import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const logs = [
  {
    title: "Migrating to Next.js 14 Server Actions",
    content: "Today, I replaced the old API routes of the project with Next.js 14 Server Actions. Instead of fetching data from the client-side using fetch APIs, we can now call functions that run directly on the server.\n\nThis has significantly improved performance and reduced unnecessary network requests. When performing state mutations, we can use `revalidatePath` and `revalidateTag` to update the cache instantly, making the UX very smooth. The code structure is also much cleaner since we don't need to separate API folders; we can write data logic directly inside components.",
    mood: "great",
    tags: ["nextjs", "react", "performance"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Building Dashboard Layout with Tailwind CSS Grid",
    content: "I rebuilt the dashboard layout using Tailwind CSS Grid utilities. I implemented a responsive Bento-box style design, carefully tuning it to gracefully degrade on mobile devices.\n\nDefining grid template columns like `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` based on screen size with responsive breakpoints is a great advantage of Tailwind. Adjusting row and column spans based on content size was slightly complex at first, but once I understood the utilities, building complex layouts became very easy.",
    mood: "good",
    tags: ["tailwindcss", "ui", "design"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Setting Up Row Level Security (RLS) in Supabase",
    content: "For database security, I configured Row Level Security (RLS) in Supabase. I wrote custom Postgres policies to ensure users can only read and write their own daily logs.\n\nUsing the `auth.uid() = user_id` policy condition, CRUD operations are only allowed if the authenticated user's ID matches the user_id of the data. Enabling RLS protects against unauthorized access even if the API key is leaked. Writing SQL policies required some trial and error, but the system is now much more secure.",
    mood: "great",
    tags: ["supabase", "security", "database"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Optimizing Supabase Database Queries",
    content: "I noticed a slight delay when opening the main feed, so I added the necessary indexes to the PostgreSQL tables. Additionally, I optimized the query when pulling data from Supabase by selecting only the columns needed (e.g. `select('id, title, created_at')`) instead of using `select('*')`.\n\nThis modification significantly reduced the network payload size and improved load time from 800ms to 120ms. I realized first-hand how important query optimization and indexing are when working with large volumes of data.",
    mood: "great",
    tags: ["postgres", "optimization", "database"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "Building a Custom React Hook for Real-time Subscriptions",
    content: "I built a custom React hook called `useRealtimeLogs` using Supabase's real-time features to instantly update the UI whenever new data enters the database.\n\nInside this hook, I used `supabase.channel()` to listen to insert changes in the `daily_logs` table. As soon as new data arrives, it is added to the React state, so the dashboard updates instantly without refreshing the page. Integrating real-time data streaming has greatly enhanced the app's user experience.",
    mood: "great",
    tags: ["react", "hooks", "realtime"],
    user_id: "00000000-0000-0000-0000-000000000000"
  }
];

async function seed() {
  console.log("🌱 Seeding daily logs in English to Supabase...");
  
  for (const log of logs) {
    const { data, error } = await supabase.from("daily_logs").insert({ ...log, locale: "en" }).select();
    
    if (error) {
      console.error(`❌ Error inserting log: "${log.title}"`, error.message);
    } else {
      console.log(`Successfully inserted: "${log.title}"`);
    }
  }
  
  console.log("🎉 Seeding complete!");
}

seed();
