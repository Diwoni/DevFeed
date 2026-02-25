'use client'

import { useState } from 'react'

interface SaveButtonProps {
  articleId: string
}

export function SaveButton({ articleId }: SaveButtonProps) {
  const [saved, setSaved] = useState(false)

  const handleClick = () => {
    if (!articleId) return
    setSaved((prev) => !prev)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        saved
          ? 'border-[var(--border-hover)] bg-[var(--surface-muted)] text-[var(--foreground)]'
          : 'border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border-hover)]'
      }`}
      aria-pressed={saved}
    >
      {saved ? '저장됨' : '저장'}
    </button>
  )
}
