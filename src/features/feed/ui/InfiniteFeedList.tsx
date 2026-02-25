'use client'

import { useMemo } from 'react'
import { useFeedArticles } from '../hooks/useFeedArticles'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { ArticleCardClient } from './ArticleCardClient'
import { SkeletonCard } from './SkeletonCard'

interface InfiniteFeedListProps {
  tagSlug?: string
  limit?: number
  query?: string
}

export function InfiniteFeedList({ tagSlug, limit = 10, query = '' }: InfiniteFeedListProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedArticles({ tagSlug, limit, query })

  const articles = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data?.pages])

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    enabled: Boolean(hasNextPage),
  })

  if (isLoading) {
    return (
      <section className="grid gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </section>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        피드 데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  return (
    <section className="grid gap-6">
      {articles.map((article) => (
        <ArticleCardClient key={article.id} article={article} />
      ))}
      {articles.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
          검색 결과가 없습니다. 다른 키워드로 다시 검색해보세요.
        </div>
      )}
      <div ref={targetRef} className="h-2" />
      {isFetchingNextPage && (
        <div className="grid gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonCard key={`fetching-${index}`} />
          ))}
        </div>
      )}
    </section>
  )
}
