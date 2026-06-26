'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deletePost(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('daily_logs')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete post: ' + error.message)
  }

  revalidatePath('/admin/posts')
  revalidatePath('/')
}

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  // Use a mock UUID for development if auth is not implemented yet or if admin posts don't matter
  const mockUserId = "00000000-0000-0000-0000-000000000000"

  const post = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    mood: (formData.get('mood') as string) || null,
    tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
    user_id: mockUserId,
  }

  const { error } = await supabase.from('daily_logs').insert(post)

  if (error) {
    throw new Error('Failed to create post: ' + error.message)
  }

  revalidatePath('/admin/posts')
  revalidatePath('/')
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()

  const post = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    mood: (formData.get('mood') as string) || null,
    tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
  }

  const { error } = await supabase.from('daily_logs').update(post).eq('id', id)

  if (error) {
    throw new Error('Failed to update post: ' + error.message)
  }

  revalidatePath('/admin/posts')
  revalidatePath('/')
}
