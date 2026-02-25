'use client'

import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onIntersect: () => void
  enabled?: boolean
  threshold?: number
}

export function useInfiniteScroll({
  onIntersect,
  enabled = true,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (!enabled) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect()
        }
      },
      { threshold }
    )

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current)
    }

    return disconnect
  }, [enabled, onIntersect, threshold, disconnect])

  return { targetRef }
}
