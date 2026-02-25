import { NextRequest, NextResponse } from 'next/server'
import { getArticles } from '@/features/feed/api/getArticles'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const tagSlug = searchParams.get('tag') ?? undefined

  try {
    const items = await getArticles({ page, limit, tagSlug })
    const nextPage = items.length < limit ? null : page + 1

    return NextResponse.json({ items, nextPage })
  } catch (error) {
    return NextResponse.json(
      { error: '피드 데이터를 불러오는 중 오류가 발생했습니다.', detail: String(error) },
      { status: 500 }
    )
  }
}
