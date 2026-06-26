'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createPost, updatePost } from '@/app/admin/(dashboard)/posts/actions'

type PostFormProps = {
  initialData?: {
    id: string
    title: string
    content: string
    mood: string | null
    tags: string[] | null
  }
}

export function PostForm({ initialData }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      if (initialData) {
        await updatePost(initialData.id, formData)
      } else {
        await createPost(formData)
      }
      router.push('/admin/posts')
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
          placeholder="Enter post title"
          className="w-full rounded-md px-4 py-2 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">Content</label>
        <textarea
          id="content"
          name="content"
          defaultValue={initialData?.content}
          required
          rows={10}
          placeholder="Write your log here..."
          className="w-full rounded-md px-4 py-2 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="mood" className="text-sm font-medium">Mood (Optional)</label>
          <input
            id="mood"
            name="mood"
            defaultValue={initialData?.mood || ''}
            placeholder="e.g. Happy, Productive"
            className="w-full rounded-md px-4 py-2 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">Tags (Comma separated)</label>
          <input
            id="tags"
            name="tags"
            defaultValue={initialData?.tags?.join(', ') || ''}
            placeholder="e.g. coding, nextjs, learning"
            className="w-full rounded-md px-4 py-2 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}
