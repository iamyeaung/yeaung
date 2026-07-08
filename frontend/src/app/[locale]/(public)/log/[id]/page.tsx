import { api } from "@/lib/api";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

const TAG_IMAGE_MAP: Record<string, string> = {
  mcp: "1518770660439-4636190af475",
  skills: "1550751827-4bd374c3f58b",
  "sub-agent": "1526374965328-7f61d4dc18c5",
  tool: "1555066931-4365d14bab8c",
  resource: "1451187580459-43490279c0fa",
  prompt: "1620712949982-297a8b87e221",
  memory: "1504164996022-090807874c65",
  checkpointer: "1635070041078-e363dbe005cb",
  harness: "1677442136019-217800a5a088",
};

const FALLBACK_IMAGE = "1677442136019-217800a5a088";

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  let log;
  let allLogs: any[] = [];

  try {
    const [logRes, listRes] = await Promise.all([
      api.dailyLogs.get(id),
      api.dailyLogs.list(locale),
    ]);
    log = logRes.data;
    allLogs = listRes.data;
  } catch (error) {
    notFound();
  }

  if (!log) {
    notFound();
  }

  // Determine Thumbnail Image
  let imageId = FALLBACK_IMAGE;
  if (log.tags && log.tags.length > 0) {
    const specificTag = log.tags.find(
      (t: string) => t.toLowerCase() !== "ai" && t.toLowerCase() !== "featured",
    );
    if (specificTag && TAG_IMAGE_MAP[specificTag.toLowerCase()]) {
      imageId = TAG_IMAGE_MAP[specificTag.toLowerCase()];
    }
  }
  const imageUrl = `https://images.unsplash.com/photo-${imageId}?w=1200&q=80&auto=format`;

  return (
    <div className="w-full bg-[#F9F8F4] dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-8 w-full">
        <Link
          href="/"
          className="inline-flex items-center text-[13px] font-bold text-gray-500 hover:text-[#FF5722] dark:hover:text-[#FF5722] mb-6 transition-colors uppercase tracking-wider"
        >
          <span className="mr-2">←</span> Back to stream
        </Link>

        <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-start">
          {/* LEFT: MAIN POST */}
          <div className="flex-1 w-full">
            <article className="rounded-[1.5rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-colors">
              {/* Thumbnail Banner */}
              <div className="w-full h-64 md:h-80 lg:h-[400px] relative bg-gray-100 dark:bg-gray-800 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                  {log.tags?.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-[#FF5722] px-3 py-1 font-bold text-[10px] text-white uppercase tracking-wider shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 md:p-10 lg:p-12">
                <header className="mb-10">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 font-bold uppercase tracking-widest transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.id}`}
                          alt="Author"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[#FF5722]">Ye Aung</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 transition-colors">
                      •
                    </span>
                    <time>
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <h1 className="text-3xl md:text-[42px] font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-[1.2] transition-colors">
                    {log.title}
                  </h1>
                </header>

                <div className="text-gray-700 dark:text-gray-300 leading-loose text-[15px] md:text-[17px] whitespace-pre-wrap font-medium transition-colors">
                  {log.content}
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT: SIDEBAR */}
          <Sidebar logs={allLogs} />
        </div>
      </div>
    </div>
  );
}
