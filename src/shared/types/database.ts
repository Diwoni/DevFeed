export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// table types

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Article {
  id: string
  title: string
  summary: string | null
  content: string | null
  url: string
  thumbnail_url: string | null
  author: string | null
  source: 'velog' | 'devto' | 'medium' | 'hashnode' | 'github'
  reading_time: number
  view_count: number
  save_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ArticleTag {
  article_id: string
  tag_id: string
}

export interface ReadingGoal {
  id: string
  user_id: string
  weekly_goal: number
  created_at: string
  updated_at: string
}

export interface ReadHistory {
  id: string
  user_id: string
  article_id: string
  read_at: string
  is_completed: boolean
}

// joined types

export interface ArticleWithTags extends Article {
  tags: Tag[]
}

export interface ReadHistoryWithArticle extends ReadHistory {
  article: Article
}

// utility types

export type ArticleSource = Article['source']

export type CreateArticle = Omit<
  Article,
  'id' | 'created_at' | 'updated_at' | 'view_count' | 'save_count'
>

export type CreateReadHistory = Omit<ReadHistory, 'id' | 'read_at'>
