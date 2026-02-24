// RSS 피드에서 추출된 raw 태그를 우리 DB의 태그 slug로 매핑
const TAG_MAP: Record<string, string> = {
  // React
  react: 'react',
  reactjs: 'react',
  'react.js': 'react',

  // TypeScript
  typescript: 'typescript',
  ts: 'typescript',

  // Next.js
  nextjs: 'nextjs',
  'next.js': 'nextjs',
  next: 'nextjs',

  // JavaScript
  javascript: 'javascript',
  js: 'javascript',
  es6: 'javascript',

  // CSS
  css: 'css',
  css3: 'css',
  tailwind: 'css',
  tailwindcss: 'css',

  // 성능 최적화
  performance: 'performance',
  optimization: 'performance',
  성능: 'performance',
  최적화: 'performance',

  // 아키텍처
  architecture: 'architecture',
  아키텍처: 'architecture',
  design: 'architecture',

  // Node.js
  node: 'nodejs',
  nodejs: 'nodejs',
  'node.js': 'nodejs',
}

export function normalizeTag(raw: string): string | null {
  const key = raw.toLowerCase().trim()
  return TAG_MAP[key] ?? null
}

export function matchTags(rawTags: string[]): string[] {
  const matched = rawTags.map(normalizeTag).filter((t): t is string => t !== null)

  // 중복 제거
  return [...new Set(matched)]
}
