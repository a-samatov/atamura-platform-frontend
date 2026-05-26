<template>
  <article class="news-card" itemscope itemtype="https://schema.org/NewsArticle">
    <NuxtLink :to="articleUrl" class="news-card__link">
      <div class="news-card__img-wrapper">
        <img
          v-if="article.cover_image"
          :src="article.cover_image"
          :alt="article.cover_alt || article.title"
          loading="lazy"
          class="news-card__img"
          itemprop="image"
        />
        <div v-else class="news-card__img-placeholder" />
      </div>
      <div class="news-card__body">
        <div class="news-card__meta">
          <time
            v-if="article.published_at"
            :datetime="article.published_at"
            itemprop="datePublished"
            class="news-card__date"
          >
            {{ formatDate(article.published_at) }}
          </time>
          <span v-if="article.tags && article.tags[0]" class="news-card__tag">
            {{ article.tags[0] }}
          </span>
        </div>
        <h3 class="news-card__title" itemprop="headline">{{ article.title }}</h3>
        <p v-if="article.seo_description" class="news-card__excerpt" itemprop="description">
          {{ article.seo_description }}
        </p>
        <span class="news-card__read-more">
          {{ readMoreLabel }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { NewsArticle } from '~/types/api'

const props = defineProps<{
  article: NewsArticle
  basePath?: string
}>()

const articleUrl = computed(() => `${props.basePath ?? '/news'}/${props.article.slug}`)

const readMoreLabel = computed(() => {
  if (props.basePath?.startsWith('/kz')) return 'Толығырақ'
  if (props.basePath?.startsWith('/en')) return 'Read more'
  return 'Читать далее'
})

const dateLocale = computed(() => {
  if (props.basePath?.startsWith('/kz')) return 'kk-KZ'
  if (props.basePath?.startsWith('/en')) return 'en-GB'
  return 'ru-RU'
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(dateLocale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped>
.news-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.news-card:hover {
  border-color: var(--color-primary);
}

.news-card__link {
  display: block;
  color: inherit;
}

.news-card__img-wrapper {
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: var(--color-gray-100);
}

.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.news-card:hover .news-card__img {
  transform: scale(1.03);
}

.news-card__img-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-light);
}

.news-card__body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.news-card__date {
  font-size: var(--text-xs);
  color: var(--color-gray-600);
}

.news-card__tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-primary);
  padding: 2px var(--space-2);
  border: 1px solid var(--color-primary);
  border-radius: 2px;
}

.news-card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
  transition: color var(--transition-fast);
}

.news-card:hover .news-card__title {
  color: var(--color-primary);
}

.news-card__excerpt {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__read-more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-primary);
  margin-top: var(--space-1);
  transition: gap var(--transition-fast);
}

.news-card:hover .news-card__read-more {
  gap: var(--space-2);
}
</style>
