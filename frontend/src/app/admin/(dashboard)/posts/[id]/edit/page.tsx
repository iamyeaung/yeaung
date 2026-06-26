import { PostForm } from '@/components/admin/PostForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditPostPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  
  const { data: post, error } = await supabase
    .from('daily_logs')
    .select('id, title, content, mood, tags')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Post</h1>
        <p className="text-muted-foreground">Make changes to your daily log.</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6">
        <PostForm initialData={post} />
      </div>
    </div>
  )
}
