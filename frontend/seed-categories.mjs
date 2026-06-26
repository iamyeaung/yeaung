import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwgtwjtzhsvnujmuhuvh.supabase.co'
const supabaseKey = 'sb_publishable_LzIPmnQz_yCcEiwH_6tqAA_nz8lDChC'
const supabase = createClient(supabaseUrl, supabaseKey)

const categories = [
  { name: 'Technology', slug: 'technology' },
  { name: 'Personal', slug: 'personal' },
  { name: 'Tutorial', slug: 'tutorial' },
  { name: 'Project', slug: 'project' },
  { name: 'AI', slug: 'ai' },
  { name: 'General', slug: 'general' }
]

async function seed() {
  const { data, error } = await supabase.from('categories').insert(categories)
  if (error) console.error('Error:', error)
  else console.log('Successfully seeded categories')
}

seed()
