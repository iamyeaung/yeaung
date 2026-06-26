import Link from "next/link";

type Log = {
  id: string;
  createdAt: string;
  mood?: string;
  title: string;
  content: string;
  tags?: string[];
};

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

export function LogCard({ log }: { log: Log }) {
  // Generate stable mock stats for UI matching
  const views = (log.title.length * 13) % 1000 + 500;
  const likes = (log.content.length * 7) % 300 + 100;
  
  // Find a relevant image based on tags
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

  return (
    <Link
      href={`/log/${log.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all flex flex-col h-full"
    >
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt="Cover" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.id}`} alt="Author" className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] font-bold text-gray-700">Steve Jobs</span>
          <span className="text-gray-300 mx-1">•</span>
          <time className="text-[10px] text-gray-400 font-medium">
            {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </time>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF5722] transition-colors leading-tight mb-3 line-clamp-2">
          {log.title}
        </h3>
        
        <div className="text-[10px] text-gray-400 font-semibold mb-3 flex items-center gap-2 uppercase tracking-widest">
          <span className="w-4 h-[1px] bg-gray-300"></span>
          {log.tags?.[0] || 'Technologies'}
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed flex-1">
          {log.content}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              {likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
              {views.toLocaleString()}
            </span>
          </div>
          
          <div className="w-8 h-8 bg-[#FF5722] rounded flex items-center justify-center text-white transition-transform group-hover:bg-[#E64A19] group-hover:scale-110 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 7l-10 10M17 7v9M17 7H8"></path></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
