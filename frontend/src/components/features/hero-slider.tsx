"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const IMAGE_MAP: Record<string, string> = {
  nextjs: "1555066931-4365d14bab8c", 
  react: "1522881193437-013143c74c15", 
  performance: "1551288049-bebda4e38f71", 
  tailwindcss: "1555939594595-814fe04cb880", 
  ui: "1561070791266-298379c65691", 
  design: "1561070791266-298379c65691", 
  supabase: "1518770660439-4636190af475", 
  security: "1550751827-4bd374c3f58b", 
  database: "1451187580459-43490279c0fa", 
  postgres: "1451187580459-43490279c0fa", 
  optimization: "1618477388954-7ea52b09a068", 
  realtime: "1518770660439-4636190af475",
  hooks: "1498050108023-c5249f4df085",
};

const FALLBACK_IMAGES = [
  "1498050108023-c5249f4df085",
  "1518770660439-4636190af475",
  "1550751827-4bd374c3f58b",
  "1451187580459-43490279c0fa",
  "1555066931-4365d14bab8c",
];

export function HeroSlider({ logs }: { logs: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!logs || logs.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % logs.length);
    }, 4500); // 4.5 seconds per slide
    return () => clearInterval(timer);
  }, [logs]);

  if (!logs || logs.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 flex items-center justify-center transition-colors">
        <p className="text-gray-400 dark:text-gray-600 text-sm font-medium transition-colors">No posts to display yet</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 bg-gray-900 group">
      {logs.map((log, index) => {
        let imageId = FALLBACK_IMAGES[log.title.length % FALLBACK_IMAGES.length];
        if (log.tags && log.tags.length > 0) {
          for (const tag of log.tags) {
            const normalizedTag = tag.toLowerCase();
            if (IMAGE_MAP[normalizedTag]) {
              imageId = IMAGE_MAP[normalizedTag];
              break;
            }
          }
        }
        const imageUrl = `https://images.unsplash.com/photo-${imageId}?w=800&q=80&auto=format`;

        const displayId = log.slug?.trim() || log.id;
        const displayCategory = log.category?.trim() ? `${log.category.trim()}/` : '';
        const href = `/${displayCategory}${displayId}`;

        return (
          <div 
            key={`hero-slider-${log.id}`}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${index === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0 pointer-events-none'}`}
          >
            <Link href={href} className="block w-full h-full cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={log.title} className="w-full h-full object-cover" />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent opacity-90" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full transform transition-transform duration-700 delay-100">
                <div className="inline-block mb-3 px-3 py-1 bg-[#FF5722] shadow-lg shadow-orange-500/30 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                  {log.tags?.[0] || 'Featured'}
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-[1.2] mb-3 line-clamp-2">
                  {log.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 leading-relaxed opacity-90">
                  {log.content}
                </p>
              </div>
            </Link>
          </div>
        );
      })}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-8 z-20 flex gap-2">
        {logs.map((_, index) => (
          <button
            key={`nav-${index}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(index); }}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${index === current ? 'bg-[#FF5722] w-8' : 'bg-white/40 hover:bg-white/70 w-2'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
