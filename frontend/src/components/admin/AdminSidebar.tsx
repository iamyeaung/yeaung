'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, LogOut, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/admin/login/actions'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-background/50 backdrop-blur-xl border-r border-border shadow-sm">
      <div className="flex h-16 items-center px-6 border-b border-border/50">
        <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight text-xl group">
          <span className="bg-primary text-primary-foreground rounded-md p-1 group-hover:scale-105 transition-transform">
            <LayoutDashboard className="h-5 w-5" />
          </span>
          Admin
        </Link>
      </div>

      <div className="flex-1 flex flex-col py-6 px-4 gap-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Menu
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </div>
      
      <div className="p-4 border-t border-border/50 flex flex-col gap-2">
        <Link 
          href="/" 
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
        >
          <ArrowLeft className="mr-3 h-5 w-5" />
          Public Site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
