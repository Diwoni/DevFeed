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
  velog: 'bg-emerald-50 text-emerald-700',
  devto: 'bg-gray-900 text-white',
  medium: 'bg-black text-white',
  hashnode: 'bg-blue-50 text-blue-700',
  github: 'bg-slate-900 text-white',
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${SOURCE_STYLE[source]}`}
    >
      {SOURCE_LABEL[source]}
    </span>
  )
}
