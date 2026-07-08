import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-muted/20">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end px-8 border-b border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
          <ThemeToggle />
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
