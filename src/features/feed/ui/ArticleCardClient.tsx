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
    <article className="flex flex-col gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SourceBadge source={article.source} />
          <span className="text-sm text-[var(--foreground-secondary)]">
            {article.author ?? '작성자 미상'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--foreground-secondary)] transition hover:border-[var(--border-hover)]"
          >
            AI 요약
          </button>
          <SaveButton articleId={article.id} />
        </div>
      </header>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          <Link
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[var(--foreground-secondary)]"
          >
            {article.title}
          </Link>
        </h2>
        {article.summary && (
          <p className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
            {article.summary}
          </p>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground-secondary)]"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--foreground-secondary)]">
          <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[11px]">
            {article.reading_time}분
          </span>
          <Link
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--foreground-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--foreground)]"
          >
            원문 보기
          </Link>
        </div>
      </footer>
    </article>
  )
}
