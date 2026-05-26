<template>
  <div v-if="job">
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="breadcrumbs" />
        <h1 class="page-header__title">Карьера в Atamura Group</h1>
        <p class="page-header__sub">{{ job.title }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container vacancy-layout">
        <div class="vacancy-body">
          <div class="vacancy-header__tags">
            <span class="vacancy-tag">{{ job.department }}</span>
            <span class="vacancy-tag vacancy-tag--gray">{{ job.employment_type }}</span>
            <span class="vacancy-tag vacancy-tag--gray">{{ job.city }}</span>
            <span v-if="job.salary_from || job.salary_to" class="vacancy-tag vacancy-tag--salary">{{ formatSalary(job) }}</span>
          </div>

          <div v-if="job.duties?.length" class="vacancy-block">
            <h2 class="vacancy-block__title">Обязанности</h2>
            <ul class="vacancy-list">
              <li v-for="item in job.duties" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div v-if="job.requirements?.length" class="vacancy-block">
            <h2 class="vacancy-block__title">Требования</h2>
            <ul class="vacancy-list">
              <li v-for="item in job.requirements" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div v-if="job.conditions?.length" class="vacancy-block">
            <h2 class="vacancy-block__title">Условия</h2>
            <ul class="vacancy-list">
              <li v-for="item in job.conditions" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>

        <aside class="vacancy-sidebar">
          <div class="apply-card">
            <h3 class="apply-card__title">Откликнуться на вакансию</h3>
            <p class="apply-card__desc">Отправьте резюме на почту — мы ответим в течение 3 рабочих дней</p>
            <a :href="`mailto:hr@atamuragroup.kz?subject=Вакансия: ${job.title}`">
              <AppButton size="lg" style="width: 100%">Отправить резюме</AppButton>
            </a>
            <p class="apply-card__email">hr@atamuragroup.kz</p>
          </div>

          <div class="other-vacancies">
            <h4 class="other-vacancies__title">Другие вакансии</h4>
            <NuxtLink to="/careers" class="other-vacancies__link">Все вакансии →</NuxtLink>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { NuxtApp } from 'nuxt/app'
import type { Job } from '~/types/api'

const route = useRoute()
const slug = route.params.slug as string
const apiBase = useApiBase()

const { data: job, error } = await useAsyncData<Job>(
  `job-ru-${slug}`,
  () => $fetch<Job>(`${apiBase}/jobs/${slug}`),
  {
    server: true,
    getCachedData(key: string, nuxtApp: NuxtApp) {
      const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
      return cached ?? undefined
    },
  }
)

if (error.value || !job.value) {
  throw createError({ statusCode: 404, message: 'Вакансия не найдена' })
}

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Карьера', href: '/careers' },
  { label: job.value.title },
]

const formatSalary = (j: Job) => {
  const currency = j.salary_currency === 'KZT' ? '₸' : j.salary_currency
  if (j.salary_from && j.salary_to) return `${j.salary_from.toLocaleString()} – ${j.salary_to.toLocaleString()} ${currency}`
  if (j.salary_from) return `от ${j.salary_from.toLocaleString()} ${currency}`
  if (j.salary_to) return `до ${j.salary_to.toLocaleString()} ${currency}`
  return ''
}

useSeoMeta({
  title: `${job.value.title} | Atamura Group`,
  description: `Вакансия ${job.value.title} в Atamura Group, ${job.value.city}. ${job.value.employment_type}.`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/careers/${slug}` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/careers/${slug}` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/careers/${slug}` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/careers/${slug}` },
  ],
})
</script>

<style scoped>
.page-header { display: flex; align-items: center; min-height: 350px; padding-bottom: var(--space-16); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); margin-top: var(--space-4); margin-bottom: var(--space-3); }
.page-header__sub { font-size: var(--text-lg); color: rgba(255,255,255,0.75); }
.vacancy-header__tags { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.vacancy-tag { font-size: var(--text-xs); font-weight: 600; padding: 4px var(--space-3); border-radius: 2px; background: var(--color-primary-light); color: var(--color-primary); }
.vacancy-tag--gray { background: var(--color-gray-100); color: var(--color-gray-600); }
.vacancy-tag--salary { background: #e8f5e9; color: #2e7d32; }
.vacancy-layout { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-12); align-items: start; }
.vacancy-body { display: flex; flex-direction: column; gap: var(--space-10); }
.vacancy-block__title { font-size: var(--text-xl); font-weight: 600; color: var(--color-dark); margin-bottom: var(--space-5); padding-bottom: var(--space-3); border-bottom: 1px solid var(--border-color); }
.vacancy-list { display: flex; flex-direction: column; gap: var(--space-3); list-style: none; }
.vacancy-list li { position: relative; padding-left: var(--space-6); font-size: var(--text-base); color: var(--color-gray-600); line-height: var(--leading-relaxed); }
.vacancy-list li::before { content: '—'; position: absolute; left: 0; color: var(--color-primary); font-weight: 600; }
.apply-card { padding: var(--space-6); border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-4); }
.apply-card__title { font-size: var(--text-lg); font-weight: 600; color: var(--color-dark); }
.apply-card__desc { font-size: var(--text-sm); color: var(--color-gray-600); line-height: var(--leading-relaxed); }
.apply-card__email { font-size: var(--text-sm); color: var(--color-gray-600); text-align: center; }
.other-vacancies { padding: var(--space-5); background: var(--color-gray-100); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; }
.other-vacancies__title { font-size: var(--text-sm); font-weight: 600; color: var(--color-dark); }
.other-vacancies__link { font-size: var(--text-sm); color: var(--color-primary); font-weight: 500; }
.vacancy-sidebar {display: grid; gap: 16px}
@media (max-width: 1024px) { .vacancy-layout { grid-template-columns: 1fr; } }
</style>
