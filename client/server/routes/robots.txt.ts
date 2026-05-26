export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public?.siteUrl as string | undefined) || 'https://atamuragroup.kz'
  const isProd = siteUrl.includes('atamuragroup.kz')

  setHeader(event, 'Content-Type', 'text/plain')

  if (!isProd) {
    return `User-agent: *\nDisallow: /`
  }

  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${siteUrl}/sitemap.xml`
})
