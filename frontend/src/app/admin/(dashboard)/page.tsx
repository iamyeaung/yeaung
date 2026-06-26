import { createClient } from '@/lib/supabase/server'
import { FileText, TrendingUp, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  const { data: logs, error } = await supabase
    .from('daily_logs')
    .select('id, created_at, title')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching logs:', error)
  }

  const totalLogs = logs?.length || 0
  const recentLogs = logs?.slice(0, 5) || []

  // Simple stats for the chart (posts per day for last 7 days)
  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const countsByDay = last7Days.map(day => {
    const count = logs?.filter(log => log.created_at.startsWith(day)).length || 0
    return { day, count }
  })
  
  const maxCount = Math.max(...countsByDay.map(d => d.count), 1) // avoid div by 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin panel. Here is what's happening.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center text-muted-foreground gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">Total Posts</h3>
          </div>
          <p className="text-4xl font-bold tracking-tighter">{totalLogs}</p>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center text-muted-foreground gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold text-sm">Activity Status</h3>
          </div>
          <p className="text-4xl font-bold tracking-tighter text-emerald-500">Active</p>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center text-muted-foreground gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-sm">Last Update</h3>
          </div>
          <p className="text-xl font-bold tracking-tight truncate mt-auto">
            {recentLogs.length > 0 ? new Date(recentLogs[0].created_at).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Activity (Last 7 Days)</h3>
          <div className="flex-1 flex items-end gap-2 h-48 mt-4 pt-4 border-t border-border/50">
            {countsByDay.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end justify-center h-full bg-secondary/50 rounded-t-md overflow-hidden">
                  <div 
                    className="w-full bg-primary transition-all duration-1000 group-hover:bg-primary/80" 
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                  />
                  {d.count > 0 && (
                    <span className="absolute bottom-2 text-primary-foreground text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{new Date(d.day).toLocaleDateString(undefined, { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Recent Posts</h3>
          <div className="flex-1 flex flex-col gap-4">
            {recentLogs.length > 0 ? (
              recentLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-1 truncate pr-4">
                    <span className="font-medium truncate">{log.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
