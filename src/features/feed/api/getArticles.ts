import { createClient } from '@/shared/lib/supabase/server'
import type { Article, ArticleWithTags, Tag } from '@/shared/types/database'

interface GetArticlesParams {
  page?: number
  limit?: number
  tagSlug?: string
  query?: string
}

interface ArticleWithTagJoin extends Article {
  article_tags?: { tag: Tag }[]
}

export async function getArticles({
  page = 1,
  limit = 10,
  tagSlug,
  query: searchQuery,
}: GetArticlesParams) {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  let supabaseQuery = supabase
    .from('articles')
    .select('*, article_tags(tag:tags(*))')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (tagSlug) {
    supabaseQuery = supabaseQuery.eq('article_tags.tags.slug', tagSlug)
  }

  if (searchQuery) {
    const keyword = `%${searchQuery}%`
    supabaseQuery = supabaseQuery.or(
      `title.ilike.${keyword},summary.ilike.${keyword},author.ilike.${keyword},article_tags.tag.name.ilike.${keyword}`
    )
  }

  const { data, error } = await supabaseQuery

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
