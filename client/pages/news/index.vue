<template>
  <div>
    <section class="news-header section section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Главная', href: '/' }, { label: 'Новости' }]" />
        <h1 class="news-header__title">Новости</h1>
        <p class="news-header__sub">Последние события Atamura Group и хода строительства</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="news && news.data && news.data.length" class="news-list-grid">
          <NewsCard v-for="article in news.data" :key="article.id" :article="article" />
        </div>
        <div v-else class="news-empty">
          <p>Новостей пока нет. Следите за обновлениями.</p>
        </div>

        <div v-if="news && news.total > news.limit" class="pagination">
          <button
            v-if="page > 1"
            class="pagination__btn"
            @click="page--"
          >← Назад</button>
          <span class="pagination__info">Страница {{ page }}</span>
          <button
            v-if="news.data.length === news.limit"
            class="pagination__btn"
            @click="page++"
          >Вперёд →</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { NewsListResponse } from '~/types/api'

useSeoMeta({
  title: 'Новости | Atamura Group',
  description: 'Последние новости строительной компании Atamura Group. Ход строительства ЖК Атмосфера, события компании, объявления.',
  ogTitle: 'Новости Atamura Group',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'canonical',  href: `${siteUrl}/news` },
    { rel: 'alternate',  hreflang: 'ru',        href: `${siteUrl}/news` },
    { rel: 'alternate',  hreflang: 'kk',        href: `${siteUrl}/kz/news` },
    { rel: 'alternate',  hreflang: 'en',        href: `${siteUrl}/en/news` },
    { rel: 'alternate',  hreflang: 'x-default', href: `${siteUrl}/news` },
  ],
})

const page = ref(1)
const limit = 12
const apiBase = useApiBase()

const { data: news, refresh } = await useAsyncData<NewsListResponse>(
  'news-ru-list',
  () => $fetch(`${apiBase}/news?lang=ru&limit=${limit}&page=${page.value}`),
  { server: false }
)

watch(page, async () => {
  await refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.page-header__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.news-header { display: flex;
  align-items: center;
  min-height: 350px; padding-top: calc(72px + var(--space-12)); padding-bottom: var(--space-12); }
.news-header__title {
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
  color: var(--color-white);
}
.news-header__sub { font-size: var(--text-lg); color: #ffffffbf; }

.news-list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.news-empty {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-gray-600);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-10);
}

.pagination__btn {
  padding: var(--space-2) var(--space-5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.pagination__btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination__info { font-size: var(--text-sm); color: var(--color-gray-600); }

@media (max-width: 1024px) { .news-list-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .news-list-grid { grid-template-columns: 1fr; } }
</style>
