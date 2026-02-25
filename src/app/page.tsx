import { getArticles } from '@/features/feed/api/getArticles'
import { FeedList } from '@/features/feed/ui/FeedList'
import { SkeletonCard } from '@/features/feed/ui/SkeletonCard'
import { Suspense } from 'react'

export const revalidate = 3600

async function FeedSection() {
  const articles = await getArticles({ page: 1, limit: 10 })
  return <FeedList articles={articles} />
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">DevFeed</h1>
        <p className="text-gray-500">개발자를 위한 개인화 콘텐츠 큐레이션 플랫폼</p>
      </header>
      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))}
            </div>
          }
        >
          <FeedSection />
        </Suspense>
      </div>
    </main>
  )
}
