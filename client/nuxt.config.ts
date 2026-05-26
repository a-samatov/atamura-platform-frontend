export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  components: [
    { path: '~/components/common', pathPrefix: false },
    { path: '~/components/forms', prefix: 'Forms' },
    { path: '~/components/kz', prefix: 'Kz' },
    { path: '~/components/en', prefix: 'En' },
    { path: '~/components/sections' },
    { path: '~/components/map' },
    { path: '~/components/news' },
  ],

  css: [
    '~/assets/css/reset.css',
    '~/assets/css/variables.css',
    '~/assets/css/global.css',
    '~/assets/css/sections.css',
  ],

  runtimeConfig: {
    // Используется только на сервере (SSR). В Docker задайте NUXT_API_BASE=http://backend:8080/api
    apiBase: process.env.NUXT_API_BASE,
    public: {
      // Используется в браузере — должен быть доступен с машины пользователя
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      siteUrl: process.env.FRONTEND_URL,
      yandexApiKey: process.env.NUXT_PUBLIC_YANDEX_API_KEY,
    },
  },

  nitro: {
    prerender: {
      routes: process.env.CI ? [] : ['/sitemap.xml', '/robots.txt'],
      crawlLinks: !process.env.CI,
    },
  },

  routeRules: {
    '/':                { ssr: true },
    '/news':            { ssr: true },
    '/news/**':         { ssr: true },
    '/careers':         { ssr: true },
    '/careers/**':      { ssr: true },
    '/kz/news/**':      { ssr: true },
    '/kz/careers':      { ssr: true },
    '/kz/careers/**':   { ssr: true },
    '/en/news/**':      { ssr: true },
    '/en/careers':      { ssr: true },
    '/en/careers/**':   { ssr: true },
    '/jk/**':           process.env.CI ? { ssr: true } : { prerender: true },
    '/about':           process.env.CI ? { ssr: true } : { prerender: true },
    '/contacts':        process.env.CI ? { ssr: true } : { prerender: true },
    '/mortgage':        process.env.CI ? { ssr: true } : { prerender: true },
    '/documents':       process.env.CI ? { ssr: true } : { prerender: true },
    '/kz':              process.env.CI ? { ssr: true } : { prerender: true },
    '/kz/**':           process.env.CI ? { ssr: true } : { prerender: true },
    '/en':              process.env.CI ? { ssr: true } : { prerender: true },
    '/en/**':           process.env.CI ? { ssr: true } : { prerender: true },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls: false,
      },
    },
  },
})
