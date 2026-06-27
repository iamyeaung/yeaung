'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'

export function SearchPosts() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const searchParamsRef = useRef(searchParams)

  // Keep ref in sync without triggering effects
  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current)
      if (query) {
        params.set('query', query)
      } else {
        params.delete('query')
      }
      params.delete('page') // reset page when searching

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    }, 300) // 300ms debounce

    return () => clearTimeout(delayDebounceFn)
  }, [query, pathname, router, startTransition])

  return (
    <div className="relative flex-1 max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-background border border-border text-foreground text-sm rounded-md focus:ring-primary focus:border-primary block w-full pl-10 p-2 transition-all"
        placeholder="Search posts..."
      />
      {isPending && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
