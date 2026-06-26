'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!name || !slug) {
    throw new Error('Name and slug are required')
  }

  const { error } = await supabase.from('categories').insert({ name, slug })

  if (error) {
    throw new Error('Failed to create category: ' + error.message)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/admin/posts/create')
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!name || !slug) {
    throw new Error('Name and slug are required')
  }

  const { error } = await supabase.from('categories').update({ name, slug }).eq('id', id)

  if (error) {
    throw new Error('Failed to update category: ' + error.message)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/admin/posts/create')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete category: ' + error.message)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/admin/posts/create')
}
