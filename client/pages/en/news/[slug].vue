<template>
  <div v-if="article" class="article-page">
    <div class="container article-page__inner">
      <aside class="article-sidebar">
        <AppBreadcrumb :items="[{ label: 'Home', href: '/en' }, { label: 'News', href: '/en/news' }, { label: article.title }]" />

        <div class="article-sidebar__meta">
          <time v-if="article.published_at" :datetime="article.published_at">
            {{ formatDate(article.published_at) }}
          </time>
          <div v-if="article.tags && article.tags.length" class="article-sidebar__tags">
            <span v-for="tag in article.tags" :key="tag" class="article-tag">{{ tag }}</span>
          </div>
        </div>

        <div class="article-sidebar__cta">
          <p class="article-sidebar__cta-text">Interested in real estate?</p>
          <AppButton @click="uiStore.openModal('application')" variant="outline" size="sm">
            Send a request
          </AppButton>
        </div>
      </aside>

      <article
        class="article-body"
        itemscope
        itemtype="https://schema.org/NewsArticle"
      >
        <header class="article-body__header">
          <h1 class="article-body__title" itemprop="headline">{{ article.title }}</h1>
        </header>

        <figure v-if="article.cover_image" class="article-body__cover">
          <img
            :src="article.cover_image"
            :alt="article.cover_alt || article.title"
            itemprop="image"
            loading="eager"
            fetchpriority="high"
            class="article-body__cover-img"
          />
        </figure>

        <div
          class="prose article-body__content"
          itemprop="articleBody"
          v-html="sanitize(article.content ?? '')"
        />

        <footer class="article-body__footer">
          <NuxtLink to="/en/news" class="article-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            All news
          </NuxtLink>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtApp } from 'nuxt/app'
import type { NewsArticle } from '~/types/api'

const route = useRoute()
const uiStore = useUiStore()
const config = useRuntimeConfig()
const { sanitize } = useSanitize()

const apiBase = useApiBase()

const { data: article, error } = await useAsyncData(
  `news-en-${route.params.slug}`,
  () => $fetch<NewsArticle>(`${apiBase}/news/${route.params.slug}?lang=en`),
  {
    server: true,
    getCachedData(key: string, nuxtApp: NuxtApp) {
      const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
      return cached ?? undefined
    },
  }
)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useSeoMeta({
  title: article.value?.seo_title || article.value?.title || 'News',
  description: article.value?.seo_description,
  ogTitle: article.value?.title,
  ogDescription: article.value?.seo_description,
  ogImage: article.value?.cover_image,
  ogType: 'article',
  articlePublishedTime: article.value?.published_at,
  articleModifiedTime: article.value?.updated_at,
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${config.public.siteUrl}/en/news/${route.params.slug}` },
    { rel: 'alternate', hreflang: 'ru', href: `${config.public.siteUrl}/news/${route.params.slug}` },
    { rel: 'alternate', hreflang: 'en', href: `${config.public.siteUrl}/en/news/${route.params.slug}` },
  ],
  script: [{
    type: 'application/ld+json',
    textContent: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.value?.title,
      description: article.value?.seo_description,
      datePublished: article.value?.published_at,
      dateModified: article.value?.updated_at,
      image: article.value?.cover_image,
      publisher: {
        '@type': 'Organization',
        name: 'Atamura Group',
        logo: { '@type': 'ImageObject', url: 'https://atamuragroup.kz/images/logo.svg' },
      },
    }),
  }],
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped>
.article-page { padding-top: calc(72px + var(--space-12)); padding-bottom: var(--space-12); }

.article-page__inner {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-12);
  align-items: start;
}

.article-sidebar {
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.article-sidebar__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.article-sidebar__meta time {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.article-sidebar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.article-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-primary);
  padding: 2px var(--space-2);
  border: 1px solid var(--color-primary);
  border-radius: 2px;
}

.article-sidebar__cta {
  padding: var(--space-5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.article-sidebar__cta-text {
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: var(--leading-relaxed);
}

.article-body__header { margin-bottom: var(--space-8); }

.article-body__title {
  font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
  line-height: var(--leading-tight);
}

.article-body__cover {
  margin-bottom: var(--space-8);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.article-body__cover-img {
  width: 100%;
  aspect-ratio: 16/7;
  object-fit: cover;
}

.article-body__content { font-size: var(--text-base); }

.article-body__footer {
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-color);
}

.article-back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  transition: color var(--transition-fast);
}

.article-back:hover { color: var(--color-primary); }

@media (max-width: 1024px) {
  .article-page__inner { grid-template-columns: 1fr; }
  .article-sidebar { position: static; }
}
</style>
