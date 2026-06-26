import Link from "next/link";
import { api } from "@/lib/api";

export async function Navbar() {
  // Fetch logs to extract dynamic categories
  const { data: logs } = await api.dailyLogs.list().catch(() => ({ data: [] }));
  const uniqueTags = Array.from(new Set(logs.flatMap((l: any) => l.tags || []))).slice(0, 4) as string[];
  const categories = uniqueTags.length > 0 ? uniqueTags : ['Next.js', 'React', 'Design', 'Backend'];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F8F4]/80 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5722] to-orange-400 text-white text-lg font-black shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110">
            Y
          </div>
          <span className="font-sans text-2xl font-extrabold tracking-tight text-gray-900">
            Ye Aung<span className="text-[#FF5722]">.</span>
          </span>
        </Link>

        {/* Desktop Menus (Dynamic Categories) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/80 p-1.5 rounded-full border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] backdrop-blur-xl">
          <Link href="/" className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-bold shadow-sm transition-transform hover:scale-[1.02]">
            All
          </Link>
          {categories.map(cat => (
            <Link 
              key={cat} 
              href={`/#feed`} 
              className="px-5 py-2 rounded-full text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all capitalize"
            >
              {cat}
            </Link>
          ))}
        </nav>

        {/* Right Action / Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/iamyeaung"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center h-10 px-5 rounded-xl bg-gray-900 text-sm font-bold text-white shadow-md transition-all hover:bg-gray-800 hover:-translate-y-0.5"
          >
            GitHub ↗
          </a>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-[#FF5722]">
             <span className="w-5 h-[2px] bg-current mb-1.5 rounded-full"></span>
             <span className="w-5 h-[2px] bg-current rounded-full"></span>
          </button>
        </div>
        
      </div>
    </header>
  );
}
