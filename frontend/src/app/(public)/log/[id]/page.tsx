import { api } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let log;
  try {
    const response = await api.dailyLogs.get(id);
    log = response.data;
  } catch (error) {
    notFound();
  }

  if (!log) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-20 w-full">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-8 transition-colors">
        <span className="mr-2">←</span> Back to stream
      </Link>
      
      <article className="rounded-3xl border border-gray-100 bg-white p-8 md:p-12 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
        <header className="mb-8 border-b border-gray-100 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 mb-6">
            <time className="font-mono bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
              {new Date(log.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}
            </time>
            {log.mood && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100 uppercase tracking-wider">
                {log.mood}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {log.title}
          </h1>
        </header>

        <div className="text-gray-700 leading-relaxed font-mono text-sm md:text-base whitespace-pre-wrap bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          {log.content}
        </div>

        {log.tags && log.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 pt-8 border-t border-gray-100">
            {log.tags.map((tag: string, idx: number) => (
              <span key={idx} className="rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-xs font-semibold text-gray-600 border border-gray-200 transition-colors hover:bg-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
