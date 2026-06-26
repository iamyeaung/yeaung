import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LogCard } from "@/components/features/log-card";

export default async function HomePage() {
  // Server-side fetching (Instant Data Load!)
  const { data: logs } = await api.dailyLogs.list().catch(() => ({ data: [] }));

  const totalLogs = logs.length;
  const greatDays = logs.filter((l) => l.mood && l.mood.includes("great")).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F4] text-gray-900 selection:bg-orange-500 selection:text-white font-sans">
      {/* Navbar Shell */}
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1200px] px-6 pb-24 pt-12 w-full">
        {/* 1. HERO SECTION (Optional, we can keep the existing one but style it slightly warmer) */}
        <div className="py-10 md:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/50 px-3 py-1 text-xs font-medium text-orange-700 mb-6">
            <span>⚡ Next.js 14 + Supabase Monolith Active</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl max-w-3xl leading-[1.05]">
            Tech.
            <span className="block mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-gray-800">
              Document your engineering breakthroughs.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed font-normal">
            A high-performance Knowledge Management System. Track daily bug fixes, preserve code snippets, and build a demonstrable Full-Stack portfolio.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/logs"
              className="inline-flex items-center justify-center rounded bg-[#FF5722] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-[#E64A19] hover:shadow-orange-500/40"
            >
              Write Daily Log ↘
            </Link>
          </div>
        </div>

        {/* 3. CONTENT AREA: MAIN + SIDEBAR */}
        <div id="feed" className="mt-12 flex flex-col xl:flex-row gap-12 items-start scroll-mt-10">
          
          {/* LEFT: LATEST ARTICLES */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-6 mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Latest Articles</h2>
              <div className="flex items-center gap-3">
                {['Technologies', 'Digital marketing', 'Business'].map(cat => (
                  <button key={cat} className="px-4 py-1.5 rounded border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center bg-white/50">
                <p className="text-sm text-gray-500 font-medium">No logs recorded yet. Your stream is a clean slate!</p>
                <Link href="/logs" className="mt-3 inline-block text-xs font-bold text-[#FF5722] hover:underline">
                  Publish your first proof-of-work →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {logs.map((log: any) => (
                  <LogCard key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="w-full xl:w-[350px] shrink-0 space-y-12">
            
            {/* Must Read Widget */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Must Read</h3>
                <a href="#" className="text-xs font-bold text-[#FF5722] hover:underline">See all ↗</a>
              </div>
              <div className="space-y-6">
                {logs.slice(0, 4).map((log: any) => (
                  <Link key={`sidebar-${log.id}`} href={`/log/${log.id}`} className="group flex gap-4 items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/seed/${log.id}/200/150`} alt="" className="w-24 h-20 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.id}`} alt="" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700">Steve Jobs</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-[#FF5722] transition-colors line-clamp-2">
                        {log.title}
                      </h4>
                      <div className="text-[10px] text-gray-400 mt-1">Technologies • 2 min read</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Subscribe Widget */}
            <div className="bg-[#2D2A3B] rounded-2xl p-8 text-center text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to our</h3>
              <h3 className="text-2xl font-bold mb-6 text-purple-400 underline decoration-purple-400/50 underline-offset-4">newsletter</h3>
              <form className="flex flex-col gap-3 relative z-10">
                <input type="email" placeholder="Enter Your Email" className="w-full px-4 py-3 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button type="submit" className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3 rounded-lg transition-colors text-sm">
                  Subscribe ↘
                </button>
              </form>
            </div>

          </aside>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}