"use client";

import { useState, useMemo } from "react";
import { Search, X, Star } from "lucide-react";
import { LogCard } from "./log-card";
import { useTranslations } from "next-intl";

import type { DailyLog } from "@/types/daily-log";

type LogFeedClientProps = {
  initialLogs: DailyLog[];
  displayFeatured: DailyLog[];
  latestLogs: DailyLog[];
};

export function LogFeedClient({
  initialLogs,
  displayFeatured,
  latestLogs,
}: LogFeedClientProps) {
  const t = useTranslations("Feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Handle input search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page to 1 when searching
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return latestLogs;
    }
    return initialLogs.filter((log) => {
      const matchTitle = log.title?.toLowerCase().includes(query);
      const matchContent = log.content?.toLowerCase().includes(query);
      const matchTags = log.tags?.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      const matchCategory = log.category?.toLowerCase().includes(query);
      return matchTitle || matchContent || matchTags || matchCategory;
    });
  }, [searchQuery, initialLogs, latestLogs]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / postsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredLogs.slice(startIndex, startIndex + postsPerPage);
  }, [filteredLogs, currentPage, postsPerPage]);

  return (
    <div className="space-y-8 w-full">
      {/* Dynamic Glassmorphism Search Bar */}
      <div className="relative w-full group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-purple-400 rounded-2xl transform opacity-5 blur-md group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden px-4 transition-colors">
          <Search className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm py-4 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
              title={t("clearSearch")}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {/* Render Featured Posts only when:
            1. Search query is empty
            2. Current page is 1
            3. There are featured posts available
        */}
        {!searchQuery && currentPage === 1 && displayFeatured.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2 transition-colors">
                <span className="text-[#FF5722] text-xl">★</span>{" "}
                {t("featured")}
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {displayFeatured.map((log) => (
                <LogCard key={`featured-${log.id}`} log={log} />
              ))}
            </div>
          </div>
        )}

        {/* Latest / Search Results Header */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6 transition-colors">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">
            {searchQuery ? (
              <span className="flex items-center gap-2">
                🔎 {t("latest")} - Search Results ({filteredLogs.length})
              </span>
            ) : (
              t("latest")
            )}
          </h2>
        </div>

        {/* Feed List */}
        {paginatedLogs.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center bg-white/50 dark:bg-gray-900/50 shadow-sm transition-colors flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">
              {searchQuery ? t("noResults") : t("empty")}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm shadow-primary/20"
              >
                {t("clearSearch")}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5 animate-in fade-in duration-500">
            {paginatedLogs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        )}

        {/* Client-side Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {/* Prev Button */}
            {currentPage > 1 ? (
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  document
                    .getElementById("feed")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm cursor-pointer"
              >
                ←
              </button>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed transition-colors">
                ←
              </div>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    document
                      .getElementById("feed")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF5722] text-white shadow-md shadow-orange-500/30"
                      : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 shadow-sm"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            {currentPage < totalPages ? (
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  document
                    .getElementById("feed")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm cursor-pointer"
              >
                →
              </button>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed transition-colors">
                →
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
