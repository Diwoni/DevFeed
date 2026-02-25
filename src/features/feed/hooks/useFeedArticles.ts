'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import type { ArticleWithTags } from '@/shared/types/database'

interface UseFeedArticlesOptions {
  tagSlug?: string
  limit?: number
  enabled?: boolean
  query?: string
}

interface FeedApiResponse {
  items: ArticleWithTags[]
  nextPage: number | null
}

export function useFeedArticles({
  tagSlug,
  limit = 10,
  enabled = true,
  query,
}: UseFeedArticlesOptions) {
  return useInfiniteQuery<FeedApiResponse>({
    queryKey: ['feed-articles', { tagSlug, limit, query }],
    initialPageParam: 1,
    enabled,
    staleTime: 1000 * 60 * 5,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      params.set('page', String(pageParam))
      params.set('limit', String(limit))
      if (tagSlug) params.set('tag', tagSlug)
      if (query) params.set('q', query)

      const response = await fetch(`/api/articles?${params.toString()}`)
      if (!response.ok) {
        throw new Error('피드 데이터를 불러오지 못했습니다.')
      }

      return (await response.json()) as FeedApiResponse
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  })
}
