import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LogCard } from "@/components/features/log-card";
import { HeroSlider } from "@/components/features/hero-slider";
import { Sidebar } from "@/components/layout/Sidebar";

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Server-side fetching (Instant Data Load!)
  const { data: logs } = await api.dailyLogs.list().catch(() => ({ data: [] }));

  // Separate Featured and Latest
  const featuredLogs = logs.filter((l: any) => l.tags && l.tags.some((tag: string) => tag.toLowerCase() === 'featured'));
  const displayFeatured = featuredLogs.length > 0 ? featuredLogs.slice(0, 2) : logs.slice(0, 2);
  const latestLogs = logs.filter((l: any) => !displayFeatured.find(f => f.id === l.id));

  // Pagination Logic (Await searchParams for Next.js 15+)
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams?.page;
  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || "1", 10);
  const postsPerPage = 5;
  const startIndex = (page - 1) * postsPerPage;
  const currentLogs = latestLogs.slice(startIndex, startIndex + postsPerPage);
  const totalPages = Math.ceil(latestLogs.length / postsPerPage);

  const totalLogs = logs.length;
  const greatDays = logs.filter((l: any) => l.mood && l.mood.includes("great")).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F4] text-gray-900 selection:bg-orange-500 selection:text-white font-sans">
      {/* Navbar Shell */}
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1200px] px-6 pb-16 pt-8 w-full">
        {/* 1. HERO SECTION */}
        <div className="relative mb-10 flex flex-col lg:flex-row items-stretch justify-between gap-6">
            
            {/* Left Side: Post Slider */}
            <div className="w-full lg:w-1/2 relative xl:max-w-[550px] flex">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-purple-400 rounded-[1.5rem] transform -rotate-1 scale-[1.02] opacity-10 blur-xl"></div>
              <div className="relative w-full h-full">
                <HeroSlider logs={logs.slice(0, 5)} />
              </div>
            </div>

            {/* Right Side: Slogan Card */}
            <div className="flex-1 w-full lg:w-1/2 flex justify-end">
              <div className="w-full h-full flex flex-col justify-center bg-white border border-gray-100 shadow-sm rounded-[1.5rem] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-50 pointer-events-none"></div>
                
                <h1 className="text-[36px] sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] relative z-10">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] to-orange-400">
                    Tech.
                  </span>
                  <span className="block mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-800">
                    Document your engineering breakthroughs.
                  </span>
                </h1>
                
                <p className="mt-5 text-[15px] sm:text-base text-gray-600 leading-relaxed font-medium relative z-10 max-w-[95%]">
                  A high-performance Knowledge Management System. Track daily bug fixes, preserve code snippets, and build a demonstrable Full-Stack portfolio.
                </p>
              </div>
            </div>

        </div>

        {/* 3. CONTENT AREA: MAIN + SIDEBAR */}
        <div id="feed" className="mt-8 flex flex-col xl:flex-row gap-8 lg:gap-10 items-start scroll-mt-24">
          
          {/* LEFT: MAIN CONTENT */}
          <div className="flex-1 w-full">
            
            {/* FEATURED POSTS (Only show on page 1) */}
            {displayFeatured.length > 0 && page === 1 && (
              <div className="mb-12">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF5722] text-xl">★</span> Featured Posts
                  </h2>
                </div>
                <div className="flex flex-col gap-5">
                  {displayFeatured.map((log: any) => (
                    <LogCard key={`featured-${log.id}`} log={log} />
                  ))}
                </div>
              </div>
            )}

            {/* LATEST ARTICLES */}
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest Articles</h2>
            </div>

            {logs.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-gray-200 p-12 text-center bg-white/50 shadow-sm">
                <p className="text-gray-500 font-medium">No logs recorded yet. Your stream is a clean slate!</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-5">
                  {currentLogs.map((log: any) => (
                    <LogCard key={log.id} log={log} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {/* Prev Button */}
                    {page > 1 ? (
                      <Link href={`/?page=${page - 1}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm scroll-smooth">
                        ←
                      </Link>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
                        ←
                      </div>
                    )}

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = page === pageNum;
                      return (
                        <Link
                          key={pageNum}
                          href={`/?page=${pageNum}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#FF5722] text-white shadow-md shadow-orange-500/30' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm'}`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}

                    {/* Next Button */}
                    {page < totalPages ? (
                      <Link href={`/?page=${page + 1}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm scroll-smooth">
                        →
                      </Link>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
                        →
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: SIDEBAR */}
          <Sidebar logs={logs} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}