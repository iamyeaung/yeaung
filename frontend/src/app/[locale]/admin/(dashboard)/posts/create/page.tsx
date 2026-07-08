import { PostForm } from '@/components/admin/PostForm'
import { createClient } from '@/lib/supabase/server'

export default async function CreatePostPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
        <p className="text-muted-foreground">Add a new entry to your daily logs.</p>
      </div>

      <PostForm categories={categories || []} />
    </div>
  )
}
