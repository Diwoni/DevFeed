import Parser from 'rss-parser'
import type { CreateArticle } from '@/shared/types/database'

const parser = new Parser({
  timeout: 10000, // 10초
  headers: {
    'User-Agent': 'DevFeed RSS Collector/1.0',
  },
})

// 글자 수 기반 읽기 시간 계산 (평균 읽기 속도: 분당 200단어)
export function calcReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / 200)
  return Math.max(1, minutes) // 최소 1분
}

// HTML 태그 제거
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim()
}

// 텍스트 요약 (최대 200자)
export function truncate(text: string, max = 200): string {
  const clean = stripHtml(text)
  return clean.length > max ? clean.slice(0, max) + '...' : clean
}

// ── 소스별 RSS 피드 URL ────────────────────────

const RSS_SOURCES = [
  {
    name: 'velog' as const,
    // 벨로그 trending 피드
    urls: ['https://v2.velog.io/rss/@trending'],
  },
  {
    name: 'devto' as const,
    urls: [
      'https://dev.to/feed/tag/react',
      'https://dev.to/feed/tag/typescript',
      'https://dev.to/feed/tag/nextjs',
    ],
  },
]

// ── 피드 파싱 결과 타입 ────────────────────────

interface ParsedArticle {
  title: string
  url: string
  summary: string
  author: string | null
  source: CreateArticle['source']
  reading_time: number
  published_at: string | null
  raw_tags: string[]
}

// ── 소스별 파싱 로직 ────────────────────────────

async function parseVelog(url: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(url)
    return feed.items.map((item) => ({
      title: item.title ?? '제목 없음',
      url: item.link ?? '',
      summary: truncate(item.content ?? item.contentSnippet ?? ''),
      author: item.creator ?? null,
      source: 'velog' as const,
      reading_time: calcReadingTime(item.content ?? item.contentSnippet ?? ''),
      published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      raw_tags: item.categories ?? [],
    }))
  } catch (error) {
    console.error(`[RSS] Velog 파싱 실패: ${url}`, error)
    return []
  }
}

async function parseDevTo(url: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(url)
    return feed.items.map((item) => ({
      title: item.title ?? '제목 없음',
      url: item.link ?? '',
      summary: truncate(item.contentSnippet ?? ''),
      author: item.creator ?? null,
      source: 'devto' as const,
      reading_time: calcReadingTime(item.contentSnippet ?? ''),
      published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      raw_tags: item.categories ?? [],
    }))
  } catch (error) {
    console.error(`[RSS] Dev.to 파싱 실패: ${url}`, error)
    return []
  }
}

// ── 메인 수집 함수 ──────────────────────────────

export async function collectAllFeeds(): Promise<ParsedArticle[]> {
  const results = await Promise.allSettled([
    ...RSS_SOURCES[0].urls.map((url) => parseVelog(url)),
    ...RSS_SOURCES[1].urls.map((url) => parseDevTo(url)),
  ])

  const articles: ParsedArticle[] = []

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value)
    }
  })

  // URL 기준 중복 제거
  const seen = new Set<string>()
  return articles.filter((a) => {
    if (!a.url || seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}

export type { ParsedArticle }
