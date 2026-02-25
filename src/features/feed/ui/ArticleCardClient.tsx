'use client'

import Link from 'next/link'
import type { ArticleWithTags } from '@/shared/types/database'
import { SourceBadge } from '@/shared/ui/badge/SourceBadge'
import { SaveButton } from './SaveButton'

interface ArticleCardClientProps {
  article: ArticleWithTags
}

export function ArticleCardClient({ article }: ArticleCardClientProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SourceBadge source={article.source} />
          <span className="text-sm text-gray-500">{article.author ?? '작성자 미상'}</span>
        </div>
        <span className="text-xs text-gray-400">
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString('ko-KR')
            : '날짜 미상'}
        </span>
      </header>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          <Link href={article.url} target="_blank" rel="noreferrer" className="hover:text-gray-700">
            {article.title}
          </Link>
        </h2>
        {article.summary && (
          <p className="text-sm leading-relaxed text-gray-600">{article.summary}</p>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{article.reading_time}분</span>
          <Link
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-900"
          >
            원문 보기
          </Link>
          <SaveButton articleId={article.id} />
        </div>
      </footer>
    </article>
  )
}
