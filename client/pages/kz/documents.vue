<template>
  <div>
    <section class="page-header section--dark">
      <div class="container">
        <AppBreadcrumb :items="[{ label: 'Басты бет', href: '/kz' }, { label: 'Құжаттар' }]" />
        <h1 class="page-header__title">Құжаттар</h1>
        <p class="page-header__sub">Барлық рұқсат беру құжаттамасы ашық қолжетімділікте</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="documents && documents.length">
          <DocumentsList :documents="documents" />
        </div>
        <div v-else class="empty-state">
          <p>Құжаттар жақын арада орналастырылады</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { Document } from '~/types/api'

useSeoMeta({
  title: 'Құжаттар | Atamura Group',
  description: 'Atamura Group құрылыс компаниясының рұқсаттары, жоба декларациясы және басқа да құжаттар.',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/kz/documents` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/documents` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/documents` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/documents` },
  ],
})

const documents = await useOptionalApi<Document[]>('/api/documents')
</script>

<style scoped>
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px; padding-bottom: var(--space-16); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); margin-top: var(--space-4); margin-bottom: var(--space-3); }
.page-header__sub { font-size: var(--text-lg); color: rgba(255,255,255,0.75); }
.empty-state { text-align: center; padding: var(--space-16); color: var(--color-gray-600); }
</style>
