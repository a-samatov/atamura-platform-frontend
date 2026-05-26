import type { NewsArticle, Job } from '~/types/api'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const config = useRuntimeConfig()
  const siteUrl = config.public?.siteUrl || 'https://atamuragroup.kz'

  let newsArticles: NewsArticle[] = []
  try {
    const response = await $fetch<{ data: NewsArticle[] }>('/api/news?lang=ru&limit=100')
    newsArticles = response.data || []
  } catch {
    // graceful — sitemap without news
  }

  let jobs: Job[] = []
  try {
    jobs = await $fetch<Job[]>('/api/jobs')
  } catch {
    // graceful — sitemap without jobs
  }

  const staticPages = [
    { url: '/',              priority: '1.0', changefreq: 'weekly'  },
    { url: '/about',         priority: '0.8', changefreq: 'monthly' },
    { url: '/news',          priority: '0.9', changefreq: 'daily'   },
    { url: '/contacts',      priority: '0.7', changefreq: 'monthly' },
    { url: '/mortgage',      priority: '0.7', changefreq: 'monthly' },
    { url: '/documents',     priority: '0.6', changefreq: 'monthly' },
    { url: '/jk/atmosfera',  priority: '0.9', changefreq: 'weekly'  },
    { url: '/kz',            priority: '0.9', changefreq: 'weekly'  },
    { url: '/kz/jk/atmosfera', priority: '0.8', changefreq: 'weekly' },
    { url: '/en',            priority: '0.8', changefreq: 'weekly'  },
    { url: '/en/jk/atmosfera', priority: '0.7', changefreq: 'weekly' },
    { url: '/en/about',      priority: '0.6', changefreq: 'monthly' },
    { url: '/en/news',       priority: '0.7', changefreq: 'daily'   },
    { url: '/kz/about',      priority: '0.6', changefreq: 'monthly' },
    { url: '/kz/news',       priority: '0.7', changefreq: 'daily'   },
    { url: '/jk/atmosfera/plans',    priority: '0.8', changefreq: 'monthly' },
    { url: '/jk/atmosfera/progress', priority: '0.7', changefreq: 'weekly'  },
    { url: '/careers',       priority: '0.7', changefreq: 'weekly'  },
    { url: '/kz/contacts',   priority: '0.6', changefreq: 'monthly' },
    { url: '/kz/documents',  priority: '0.5', changefreq: 'monthly' },
    { url: '/kz/careers',    priority: '0.7', changefreq: 'weekly'  },
    { url: '/en/contacts',   priority: '0.6', changefreq: 'monthly' },
    { url: '/en/documents',  priority: '0.5', changefreq: 'monthly' },
    { url: '/en/careers',    priority: '0.7', changefreq: 'weekly'  },
  ]

  const newsPages = newsArticles.map(article => ({
    url:        `/news/${article.slug}`,
    priority:   '0.8',
    changefreq: 'never',
    lastmod:    article.updated_at,
  }))

  const jobPages = jobs.flatMap(job => [
    { url: `/careers/${job.slug}`,     priority: '0.8', changefreq: 'monthly', lastmod: job.updated_at },
    { url: `/kz/careers/${job.slug}`,  priority: '0.7', changefreq: 'monthly', lastmod: job.updated_at },
    { url: `/en/careers/${job.slug}`,  priority: '0.7', changefreq: 'monthly', lastmod: job.updated_at },
  ])

  const now = new Date().toISOString()

  const urls = [...staticPages, ...newsPages, ...jobPages].map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${'lastmod' in page ? page.lastmod : now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`
})
