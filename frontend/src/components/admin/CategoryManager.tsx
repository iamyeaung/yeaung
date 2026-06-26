'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/(dashboard)/categories/actions'

type Category = {
  id: string;
  name: string;
  slug: string;
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Handlers for Add
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await createCategory(formData)
      setIsAdding(false)
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Failed to add category')
    }
  }

  // Handlers for Edit
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await updateCategory(id, formData)
      setEditingId(null)
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Failed to update category')
    }
  }

  // Handlers for Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Failed to delete category')
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-lg">All Categories</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
      
      <div className="divide-y divide-border">
        {/* Add Form Row */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-muted/20 flex items-center gap-4">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Name (e.g. Technology)" required className="px-3 py-2 rounded-md border border-border bg-background text-sm w-full focus:ring-2 focus:ring-primary/50 focus:outline-none" />
              <input type="text" name="slug" placeholder="Slug (e.g. technology)" required className="px-3 py-2 rounded-md border border-border bg-background text-sm w-full focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-colors"><Check className="h-4 w-4" /></button>
              <button type="button" onClick={() => setIsAdding(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"><X className="h-4 w-4" /></button>
            </div>
          </form>
        )}

        {/* Categories List Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>Name</div>
            <div>Slug</div>
          </div>
          <div className="w-[88px] text-right">Actions</div>
        </div>

        {/* Categories List */}
        {initialCategories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No categories found. Create one!</div>
        ) : (
          initialCategories.map((cat) => (
            <div key={cat.id}>
              {editingId === cat.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, cat.id)} className="p-4 bg-muted/10 flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input type="text" name="name" defaultValue={cat.name} required className="px-3 py-2 rounded-md border border-border bg-background text-sm w-full focus:ring-2 focus:ring-primary/50 focus:outline-none" />
                    <input type="text" name="slug" defaultValue={cat.slug} required className="px-3 py-2 rounded-md border border-border bg-background text-sm w-full focus:ring-2 focus:ring-primary/50 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="submit" className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-colors"><Check className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"><X className="h-4 w-4" /></button>
                  </div>
                </form>
              ) : (
                <div className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="font-medium text-sm">{cat.name}</div>
                    <div className="text-muted-foreground text-sm">{cat.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingId(cat.id)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
