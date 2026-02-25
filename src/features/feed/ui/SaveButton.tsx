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
      className={
        saved
          ? 'rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white'
          : 'rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700'
      }
      aria-pressed={saved}
    >
      {saved ? '저장됨' : '저장'}
    </button>
  )
}
