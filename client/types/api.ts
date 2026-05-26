export interface NewsArticle {
  id: string
  slug: string
  lang: string
  title: string
  content?: string
  cover_image?: string
  cover_alt?: string
  seo_title?: string
  seo_description?: string
  tags?: string[]
  jk_slug?: string
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface NewsListResponse {
  data: NewsArticle[]
  total: number
  page: number
  limit: number
}

export interface Video {
  id: string
  jk_slug: string
  title: string
  youtube_id?: string
  direct_url?: string
  thumbnail?: string
  published_at?: string
  sort_order: number
}

export interface ProgressPhoto {
  id: string
  jk_slug: string
  title?: string
  description?: string
  photo_url: string
  image_url: string
  stage?: string
  taken_at: string
  created_at: string
  sort_order: number
}

export interface Review {
  id: string
  jk_slug?: string
  lang: string
  author_name: string
  author_photo?: string
  text: string
  rating?: number
  published: boolean
  created_at: string
}

export interface Document {
  id: string
  jk_slug?: string
  title: string
  file_url: string
  doc_type?: string
  sort_order: number
}

export interface ApplicationPayload {
  type: string
  jk_slug?: string
  plan_id?: string
  plan_name?: string
  name: string
  phone: string
  lang?: string
  source?: string
  bank?: string
  message?: string
  quiz_answers?: Record<string, string>
}

export interface Job {
  id: string
  slug: string
  title: string
  department: string
  city: string
  employment_type: string
  salary_from?: number
  salary_to?: number
  salary_currency: string
  duties: string[]
  requirements: string[]
  conditions: string[]
  status: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface JKMarker {
  lat: number
  lng: number
  title: string
  description?: string
  jkSlug?: string
}
