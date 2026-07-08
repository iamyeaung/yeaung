import Link from "next/link";

type Log = {
  id: string;
  createdAt: string;
  mood?: string;
  title: string;
  content: string;
  tags?: string[];
  slug?: string | null;
  category?: string | null;
  image_url?: string | null;
};

const TAG_IMAGE_MAP: Record<string, string> = {
  mcp: "1518770660439-4636190af475",
  skills: "1550751827-4bd374c3f58b",
  "sub-agent": "1451187580459-43490279c0fa",
  tool: "1555066931-4365d14bab8c",
  resource: "1451187580459-43490279c0fa",
  prompt: "1522881193437-013143c74c15",
  memory: "1551288049-bebda4e38f71",
  checkpointer: "1555939594595-814fe04cb880",
  harness: "1561070791266-298379c65691",
  nextjs: "1555066931-4365d14bab8c",
  react: "1522881193437-013143c74c15",
};

const FALLBACK_IMAGE = "1498050108023-c5249f4df085";

export function LogCard({ log }: { log: Log }) {
  // Find a highly relevant image based on the specific tags (ignoring generic 'ai' tag)
  let imageId = FALLBACK_IMAGE;
  if (log.tags && log.tags.length > 0) {
    const specificTag = log.tags.find(
      (t) => t.toLowerCase() !== "ai" && t.toLowerCase() !== "featured",
    );
    if (specificTag && TAG_IMAGE_MAP[specificTag.toLowerCase()]) {
      imageId = TAG_IMAGE_MAP[specificTag.toLowerCase()];
    }
  }
  const imageUrl =
    log.image_url ||
    `https://images.unsplash.com/photo-${imageId}?w=800&q=80&auto=format`;
  const displayId = log.slug?.trim() || log.id;
  const displayCategory = log.category?.trim() ? `${log.category.trim()}/` : "";
  const href = `/${displayCategory}${displayId}`;

  return (
    <Link
      href={href}
      className="group flex flex-col sm:flex-row bg-white dark:bg-gray-900/50 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800 transition-all duration-300"
    >
      {/* Left Side: Image */}
      <div className="relative w-full sm:w-[40%] sm:max-w-[320px] h-56 sm:h-full bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 transition-colors">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>

      {/* Right Side: Content */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 justify-center relative">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.id}`}
                alt="Author"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-extrabold text-gray-700 dark:text-gray-200 transition-colors">
              Ye Aung
            </span>
          </div>
          <span className="text-gray-300 dark:text-gray-600 transition-colors">
            •
          </span>
          <time className="text-[11px] text-gray-500 dark:text-gray-400 font-bold transition-colors">
            {new Date(log.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span className="text-gray-300 dark:text-gray-600 hidden sm:inline transition-colors">
            •
          </span>
          <div className="text-[10px] text-[#FF5722] font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded ml-auto sm:ml-0 transition-colors">
            {log.tags?.[0] || "Technologies"}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#FF5722] dark:group-hover:text-[#FF5722] transition-colors leading-[1.8] mb-2 py-1">
          {log.title?.length > 80
            ? log.title.substring(0, 80) + "..."
            : log.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-[1.9] font-medium py-1 transition-colors">
          {log.content?.length > 130
            ? log.content.substring(0, 130) + "..."
            : log.content}
        </p>
      </div>
    </Link>
  );
}
