import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            DevPulse
          </Link>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">About</Link>
              <Link href="/privacy" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
            </div>
            <Link
              href="/logs"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Daily Logs
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
