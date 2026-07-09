import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/features/hero-slider";
import { Sidebar } from "@/components/layout/Sidebar";
import { getTranslations } from "next-intl/server";
import { LogFeedClient } from "@/components/features/log-feed-client";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero");
  const tFeed = await getTranslations("Feed");

  // Server-side fetching (Instant Data Load!)
  const { data: logs } = await api.dailyLogs
    .list(locale)
    .catch(() => ({ data: [] }));

  // Separate Featured and Latest
  const featuredLogs = logs.filter(
    (l: any) =>
      l.tags && l.tags.some((tag: string) => tag.toLowerCase() === "featured"),
  );
  const displayFeatured =
    featuredLogs.length > 0 ? featuredLogs.slice(0, 2) : logs.slice(0, 2);
  const latestLogs = logs.filter(
    (l: any) => !displayFeatured.find((f) => f.id === l.id),
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F4] dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-orange-500 selection:text-white font-sans transition-colors">
      {/* Navbar Shell */}
      <Navbar locale={locale} />

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
            <div className="w-full h-full flex flex-col justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-[1.5rem] p-8 md:p-10 relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-3xl -ml-20 -mb-20 opacity-50 pointer-events-none transition-colors"></div>

              <h1 className="text-[36px] sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1] relative z-10 transition-colors">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] to-orange-400">
                  {tHero("tech")}
                </span>
                <span className="block mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-200 transition-colors">
                  {tHero("slogan")}
                </span>
              </h1>

              <p className="mt-5 text-[15px] sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium relative z-10 max-w-[95%] transition-colors">
                {tHero("description")}
              </p>
            </div>
          </div>
        </div>

        {/* 3. CONTENT AREA: MAIN + SIDEBAR */}
        <div
          id="feed"
          className="mt-8 flex flex-col xl:flex-row gap-6 lg:gap-12 items-start scroll-mt-24"
        >
          {/* LEFT: MAIN CONTENT */}
          <div className="flex-1 w-full">
            <LogFeedClient
              initialLogs={logs}
              displayFeatured={displayFeatured}
              latestLogs={latestLogs}
            />
          </div>

          {/* RIGHT: SIDEBAR */}
          <Sidebar logs={logs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
