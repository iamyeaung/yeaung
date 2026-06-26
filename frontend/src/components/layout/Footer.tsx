import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-gray-900">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          Ye Aung<span className="text-orange-500">.</span>
        </div>
        
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
        </nav>
        
        <div className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Ye Aung. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
