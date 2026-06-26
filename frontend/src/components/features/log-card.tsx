"use client";

import { useState } from "react";

type Log = {
  id: string;
  createdAt: string;
  mood?: string;
  title: string;
  content: string;
  tags?: string[];
};

export function LogCard({ log }: { log: Log }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md cursor-pointer"
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
        <p className={`mt-2.5 font-mono text-xs text-gray-500 leading-relaxed bg-gray-50/50 p-2.5 rounded border border-gray-50 ${isExpanded ? "" : "line-clamp-3"}`}>
          {log.content}
        </p>
      </div>

      {/* Tags */}
      {log.tags && log.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-gray-50">
          {log.tags.map((tag: string, idx: number) => (
            <span key={idx} className="rounded bg-blue-50/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-700">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
