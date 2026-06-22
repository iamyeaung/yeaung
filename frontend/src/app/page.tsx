import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";

export default async function HomePage() {
  // Server-side fetching (Instant Data Load!)
  const { data: logs } = await api.dailyLogs.list().catch(() => ({ data: [] }));

  const totalLogs = logs.length;
  const greatDays = logs.filter((l) => l.mood && l.mood.includes("great")).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 selection:bg-blue-500 selection:text-white">
      {/* Navbar Shell */}
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
        {/* 1. HERO SECTION */}
        <div className="py-10 md:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-xs font-medium text-blue-700 mb-6">
            <span>⚡ Next.js 14 + Supabase Monolith Active</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl max-w-3xl leading-[1.1]">
            Document your engineering <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">breakthroughs.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-600 leading-relaxed font-normal">
            A high-performance Knowledge Management System. Track daily bug fixes, preserve code snippets, and build a demonstrable Full-Stack portfolio.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/logs"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
            >
              Write Daily Log →
            </Link>
            <a
              href="#feed"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              Explore Stream ↓
            </a>
          </div>
        </div>

        {/* 2. STATS / BENTO ROW */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-16">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-gray-200 transition-all">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Proofs</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">{totalLogs}</div>
            <div className="mt-1 text-xs text-green-600 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 100% Synced
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-gray-200 transition-all">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Vibe Check</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">{greatDays} 🔥</div>
            <div className="mt-1 text-xs text-gray-400">Great days recorded</div>
          </div>

          <div className="col-span-2 md:col-span-1 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-indigo-50/10 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-950 uppercase tracking-wider">Stack Engine</div>
              <div className="mt-2 font-mono text-xs text-blue-700 leading-relaxed">
                Next.js SSR • Supabase RLS • Tailwind CSS
              </div>
            </div>
            <div className="mt-4 text-right">
              <span className="text-[10px] font-bold tracking-widest text-blue-900 uppercase bg-blue-100 px-2 py-0.5 rounded">
                Production Ready
              </span>
            </div>
          </div>
        </div>

        {/* 3. RECENT LOGS STREAM */}
        <div id="feed" className="space-y-6 scroll-mt-10">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Engineering Stream</h2>
            <span className="text-xs font-mono text-gray-400">Live Postgres Fetch</span>
          </div>

          {logs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center bg-white/50">
              <p className="text-sm text-gray-500 font-medium">No logs recorded yet. Your stream is a clean slate!</p>
              <Link href="/logs" className="mt-3 inline-block text-xs font-bold text-blue-600 hover:underline">
                Publish your first proof-of-work →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <time className="font-mono">
                        {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                      {log.mood && (
                        <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold text-gray-600 border border-gray-100">
                          {log.mood.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {log.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 font-mono text-xs text-gray-500 leading-relaxed bg-gray-50/50 p-2.5 rounded border border-gray-50">
                      {log.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {log.tags && log.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-gray-50">
                      {log.tags.map((tag, idx) => (
                        <span key={idx} className="rounded bg-blue-50/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}