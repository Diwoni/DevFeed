import type { ArticleWithTags } from '@/shared/types/database'
import { ArticleCard } from './ArticleCard'

interface FeedListProps {
  articles: ArticleWithTags[]
}

export function FeedList({ articles }: FeedListProps) {
  return (
    <section className="grid gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </section>
  )
}
