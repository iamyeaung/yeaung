'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createPost, updatePost } from '@/app/admin/(dashboard)/posts/actions'
import dynamic from 'next/dynamic'
import rehypeSanitize from 'rehype-sanitize'
import { useTheme } from 'next-themes'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// Dynamic import for the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

type PostFormProps = {
  initialData?: {
    id: string
    title: string
    content: string
    mood: string | null
    tags: string[] | null
    slug?: string | null
    category?: string | null
  }
  categories: { id: string, name: string, slug: string }[]
}

export function PostForm({ initialData, categories }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState(initialData?.content || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const displayId = slug.trim() ? slug.trim() : (initialData?.id || 'new-post-id')
  const displayCategory = category.trim() ? `${category.trim()}/` : ''
  const previewUrl = `${baseUrl}/${displayCategory}${displayId}`

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    // Inject the markdown content into formData
    formData.set('content', content)
    
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
    <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-6 items-start animate-in fade-in duration-500">
      
      {/* MAIN COLUMN (Left) */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {error && (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
            {error}
          </div>
        )}
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Title</label>
            <input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="Enter post title"
              className="w-full rounded-md px-4 py-2 bg-background border border-border text-foreground font-medium text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2" data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}>
            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Content (Markdown)</label>
            <div className="border border-border rounded-md overflow-hidden bg-background">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                height={600}
                className="w-full !border-0 text-base"
                textareaProps={{
                  placeholder: 'Write your log here using Markdown...',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR COLUMN (Right) */}
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        
        {/* Settings Block */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="font-semibold text-sm border-b border-border pb-3 uppercase tracking-wider text-muted-foreground">Settings</h3>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">Custom URL (Slug)</label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. my-custom-post"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <p className="text-xs text-muted-foreground break-all mt-1">
              Preview: <a href={previewUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{previewUrl}</a>
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="mood" className="text-sm font-medium">Mood (Optional)</label>
            <input
              id="mood"
              name="mood"
              defaultValue={initialData?.mood || ''}
              placeholder="e.g. Happy, Productive"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">Tags</label>
            <input
              id="tags"
              name="tags"
              defaultValue={initialData?.tags?.join(', ') || ''}
              placeholder="coding, nextjs (comma separated)"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Publish Block */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm border-b border-border pb-3 uppercase tracking-wider text-muted-foreground">Publish</h3>
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center items-center bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}
