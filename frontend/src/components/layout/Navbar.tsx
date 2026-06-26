import Link from "next/link";

export function Navbar() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 border-b border-gray-100">
      <div className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight">
        <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        <Link href="/">Ye Aung<span className="text-orange-500">.</span></Link>
      </div>
      <nav className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          <Link href="/privacy" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Terms</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link>
        </div>
        <Link
          href="/logs"
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
        >
          + Write Log
        </Link>
      </nav>
    </header>
  );
}
