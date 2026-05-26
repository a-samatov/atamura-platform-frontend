<template>
  <div>
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Басты бет', href: '/kz' }, { label: 'Жаңалықтар' }]" />
        <h1 class="page-header__title">Жаңалықтар</h1>
        <p class="page-header__sub">Atamura Group ЖК Атмосфера жобалары туралы соңғы жаңалықтар</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="data && data.data && data.data.length" class="news-grid">
          <NewsCard
            v-for="article in data.data"
            :key="article.id"
            :article="article"
            :base-path="'/kz/news'"
          />
        </div>
        <div v-else class="empty-state">
          <p>Жаңалықтар жақында жарияланады</p>
        </div>

        <nav v-if="data && data.total > limit" class="pagination" aria-label="Беттеу">
          <button
            class="pagination__btn"
            :disabled="page <= 1"
            @click="page--"
            aria-label="Алдыңғы бет"
          >← Алдыңғы</button>
          <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
          <button
            class="pagination__btn"
            :disabled="page >= totalPages"
            @click="page++"
            aria-label="Келесі бет"
          >Келесі →</button>
        </nav>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { NewsListResponse } from '~/types/api'

useSeoMeta({
  title: 'Жаңалықтар | Atamura Group',
  description: 'Atamura Group компаниясының соңғы жаңалықтары: құрылыс барысы, жаңа жобалар, акциялар.',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/kz/news` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/news` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/news` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/news` },
  ],
})

const page = ref(1)
const limit = 9
const apiBase = useApiBase()

const { data } = await useAsyncData(
  () => `news-kz-${page.value}`,
  () => $fetch<NewsListResponse>(`${apiBase}/news?lang=kk&page=${page.value}&limit=${limit}`),
  { server: false }
)

const totalPages = computed(() => data.value ? Math.ceil(data.value.total / limit) : 1)

watch(page, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.page-header__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px; padding-bottom: var(--space-16); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); }
.page-header__sub { font-size: var(--text-lg); color: rgba(255,255,255,0.75); }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
.empty-state { text-align: center; padding: var(--space-20); color: var(--color-gray-600); }
.pagination { display: flex; justify-content: center; align-items: center; gap: var(--space-6); margin-top: var(--space-12); }
.pagination__btn { padding: var(--space-3) var(--space-6); border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: none; cursor: pointer; font-size: var(--text-sm); font-weight: 500; color: var(--color-dark); transition: border-color var(--transition-base), color var(--transition-base); }
.pagination__btn:disabled { opacity: 0.4; cursor: default; }
.pagination__btn:not(:disabled):hover { border-color: var(--color-primary); color: var(--color-primary); }
.pagination__info { font-size: var(--text-sm); color: var(--color-gray-600); }
@media (max-width: 1024px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .news-grid { grid-template-columns: 1fr; } }
</style>
