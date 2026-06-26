import { PostForm } from '@/components/admin/PostForm'

export default function CreatePostPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
        <p className="text-muted-foreground">Add a new entry to your daily logs.</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6">
        <PostForm />
      </div>
    </div>
  )
}
