import { createClient } from '@/shared/lib/supabase/server'
import type { Article, ArticleWithTags, Tag } from '@/shared/types/database'

interface GetArticlesParams {
  page?: number
  limit?: number
  tagSlug?: string
}

interface ArticleWithTagJoin extends Article {
  article_tags?: { tag: Tag }[]
}

export async function getArticles({ page = 1, limit = 10, tagSlug }: GetArticlesParams) {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('articles')
    .select('*, article_tags(tag:tags(*))')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (tagSlug) {
    query = query.eq('article_tags.tags.slug', tagSlug)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  const articles = (data ?? []).map((row) => {
    const article = row as ArticleWithTagJoin
    const tags = article.article_tags?.map((item) => item.tag).filter(Boolean) ?? []
    const { article_tags: _articleTags, ...rest } = article

    return {
      ...(rest as Article),
      tags,
    } satisfies ArticleWithTags
  })

  return articles
}
