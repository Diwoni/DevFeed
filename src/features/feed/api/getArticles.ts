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
    const matchedArticleIds = new Set<string>()

    const [{ data: textMatches, error: textError }, { data: tagMatches, error: tagError }] =
      await Promise.all([
        supabase
          .from('articles')
          .select('id')
          .or(`title.ilike.${keyword},summary.ilike.${keyword},author.ilike.${keyword}`),
        supabase.from('tags').select('id').or(`name.ilike.${keyword},slug.ilike.${keyword}`),
      ])

    if (textError) throw textError
    if (tagError) throw tagError

    textMatches?.forEach((row) => matchedArticleIds.add(row.id))

    const tagIds = tagMatches?.map((tag) => tag.id) ?? []
    if (tagIds.length > 0) {
      const { data: articleTagMatches, error: articleTagError } = await supabase
        .from('article_tags')
        .select('article_id')
        .in('tag_id', tagIds)

      if (articleTagError) throw articleTagError

      articleTagMatches?.forEach((row) => matchedArticleIds.add(row.article_id))
    }

    const ids = [...matchedArticleIds]
    if (ids.length === 0) {
      return []
    }

    supabaseQuery = supabaseQuery.in('id', ids)
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
