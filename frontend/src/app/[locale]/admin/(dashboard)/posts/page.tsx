import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit } from 'lucide-react'
import { DeletePostButton } from '@/components/admin/DeletePostButton'
import { SearchPosts } from '@/components/admin/SearchPosts'
import { Pagination } from '@/components/admin/Pagination'

export default async function AdminPostsPage({
  searchParams
}: {
  searchParams?: Promise<{ query?: string, page?: string }>
}) {
  const supabase = await createClient()
  
  const params = await searchParams
  const query = params?.query || ''
  const currentPage = Number(params?.page) || 1
  const ITEMS_PER_PAGE = 10
  
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  let supabaseQuery = supabase
    .from('daily_logs')
    .select('id, title, created_at, mood, tags, category', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  const { data: logs, count, error } = await supabaseQuery

  if (error) {
    console.error('Error fetching logs:', error)
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Posts</h1>
          <p className="text-muted-foreground">View, edit, and delete your daily logs.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <SearchPosts />
          <Link 
            href="/admin/posts/create"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Create
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Mood</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground max-w-[300px] truncate">
                      {log.title}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {log.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {log.category}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.mood ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {log.mood}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link
                        href={`/admin/posts/${log.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeletePostButton id={log.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                    {query ? (
                      <>
                        <span className="text-lg font-medium mb-1">No results found</span>
                        <span>We couldn't find anything matching "{query}".</span>
                      </>
                    ) : (
                      'No posts found.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  )
}
