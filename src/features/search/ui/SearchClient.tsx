'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { InfiniteFeedList } from '@/features/feed/ui/InfiniteFeedList'

export function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const handler = setTimeout(() => {
      const current = searchParams.get('q') ?? ''
      if (query === current) return

      const nextParams = new URLSearchParams(searchParams)
      if (query) {
        nextParams.set('q', query)
      } else {
        nextParams.delete('q')
      }
      const nextQuery = nextParams.toString()
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
    }, 300)

    return () => clearTimeout(handler)
  }, [query, pathname, router, searchParams])

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">검색</h1>
        <p className="text-gray-500">키워드로 아티클을 찾아보세요.</p>
      </header>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예) Next.js, 상태관리, 성능 최적화"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="mt-8">
        <InfiniteFeedList query={query} />
      </div>
    </main>
  )
}
