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
    <main className="mx-auto max-w-[1280px] px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.3em] text-[var(--foreground-muted)] uppercase">
          검색
        </p>
        <h1 className="text-3xl font-semibold text-[var(--foreground)]">검색</h1>
        <p className="text-[var(--foreground-secondary)]">키워드로 아티클을 찾아보세요.</p>
      </header>

      <div className="mt-6 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예) Next.js, 상태관리, 성능 최적화"
          className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--border-hover)] focus:outline-none"
        />
      </div>

      <div className="mt-8 space-y-2">
        <p className="text-xs text-[var(--foreground-muted)]">검색 결과</p>
        <InfiniteFeedList query={query} />
      </div>
    </main>
  )
}
