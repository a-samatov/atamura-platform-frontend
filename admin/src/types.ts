export interface Manager {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'super_admin'
  created_at: string
}

export interface Application {
  id: string
  type: string
  jk_slug: string | null
  plan_id: string | null
  plan_name: string | null
  name: string
  phone: string
  lang: string
  source?: string | null
  bank?: string | null
  message?: string | null
  quiz_answers: Record<string, unknown> | null
  status: 'new' | 'in_progress' | 'closed_won' | 'closed_lost'
  manager_note: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  slug: string
  lang: 'ru' | 'kk' | 'en'
  title: string
  content: string
  cover_image: string | null
  cover_alt: string | null
  seo_title: string | null
  seo_description: string | null
  tags: string[] | null
  jk_slug: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  jk_slug: string
  title: string
  youtube_id: string | null
  direct_url: string | null
  thumbnail: string | null
  published_at: string | null
  sort_order: number
  created_at: string
}

export interface ProgressPhoto {
  id: string
  jk_slug: string
  title: string | null
  description: string | null
  photo_url: string
  stage: string | null
  taken_at: string
  sort_order: number
  created_at: string
}

export interface Review {
  id: string
  jk_slug: string | null
  lang: 'ru' | 'kk' | 'en'
  author_name: string
  author_photo: string | null
  text: string
  rating: number | null
  published: boolean
  created_at: string
}

export interface Document {
  id: string
  jk_slug: string | null
  title: string
  file_url: string
  doc_type: string | null
  sort_order: number
  created_at: string
}

export interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
