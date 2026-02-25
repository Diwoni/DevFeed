import type { ArticleSource } from '@/shared/types/database'

interface SourceBadgeProps {
  source: ArticleSource
}

const SOURCE_LABEL: Record<ArticleSource, string> = {
  velog: 'Velog',
  devto: 'Dev.to',
  medium: 'Medium',
  hashnode: 'Hashnode',
  github: 'GitHub',
}

const SOURCE_STYLE: Record<ArticleSource, string> = {
  velog: 'bg-[rgba(62,207,142,0.1)] text-[#3ecf8e]',
  devto: 'bg-[rgba(167,139,250,0.1)] text-[#a78bfa]',
  medium: 'bg-[rgba(255,159,74,0.1)] text-[#ff9f4a]',
  hashnode: 'bg-[rgba(79,143,255,0.1)] text-[#4f8fff]',
  github: 'bg-[rgba(255,255,255,0.08)] text-[var(--foreground-secondary)]',
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] ${SOURCE_STYLE[source]}`}
    >
      {SOURCE_LABEL[source]}
    </span>
  )
}
