import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { collectAllFeeds } from '@/shared/lib/rss/parser'
import { matchTags } from '@/shared/lib/rss/tag-matcher'

// Vercel Cron 또는 수동 트리거용 엔드포인트
// GET /api/rss/collect
export async function GET(request: NextRequest) {
  // 보안: 올바른 토큰이 없으면 거부
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const startTime = Date.now()

  try {
    // 1. 모든 RSS 피드 수집
    console.log('[RSS] 피드 수집 시작...')
    const parsedArticles = await collectAllFeeds()
    console.log(`[RSS] ${parsedArticles.length}개 아티클 파싱 완료`)

    // 2. DB에서 현재 태그 목록 조회
    const { data: existingTags, error: tagError } = await supabase.from('tags').select('id, slug')

    if (tagError) throw tagError

    const tagMap = new Map(existingTags?.map((t) => [t.slug, t.id]) ?? [])

    // 3. 아티클 upsert (중복 URL은 업데이트)
    let saved = 0
    let skipped = 0

    for (const article of parsedArticles) {
      if (!article.url || !article.title) {
        skipped++
        continue
      }

      // 아티클 저장
      const { data: savedArticle, error: articleError } = await supabase
        .from('articles')
        .upsert(
          {
            title: article.title,
            summary: article.summary || null,
            url: article.url,
            author: article.author,
            source: article.source,
            reading_time: article.reading_time,
            published_at: article.published_at,
          },
          {
            onConflict: 'url', // URL이 같으면 업데이트
            ignoreDuplicates: false,
          }
        )
        .select('id')
        .single()

      if (articleError || !savedArticle) {
        console.error(`[RSS] 아티클 저장 실패: ${article.url}`, articleError)
        skipped++
        continue
      }

      // 태그 연결
      const matchedSlugs = matchTags(article.raw_tags)
      const tagIds = matchedSlugs.map((slug) => tagMap.get(slug)).filter((id): id is string => !!id)

      if (tagIds.length > 0) {
        await supabase.from('article_tags').upsert(
          tagIds.map((tagId) => ({
            article_id: savedArticle.id,
            tag_id: tagId,
          })),
          { onConflict: 'article_id,tag_id', ignoreDuplicates: true }
        )
      }

      saved++
    }

    const elapsed = Date.now() - startTime

    console.log(`[RSS] 완료 — 저장: ${saved}, 스킵: ${skipped}, 소요: ${elapsed}ms`)

    return NextResponse.json({
      success: true,
      stats: {
        total: parsedArticles.length,
        saved,
        skipped,
        elapsed_ms: elapsed,
      },
    })
  } catch (error) {
    console.error('[RSS] 수집 실패:', error)
    return NextResponse.json(
      { error: '수집 중 오류가 발생했습니다.', detail: String(error) },
      { status: 500 }
    )
  }
}
