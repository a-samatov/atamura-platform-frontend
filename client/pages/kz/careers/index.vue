<template>
  <div>
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Басты бет', href: '/kz' }, { label: 'Бос орындар' }]" />
        <h1 class="page-header__title">Atamura Group-та мансап</h1>
        <p class="page-header__sub">Сапалы тұрғын үй салатын командаға қосылыңыз</p>
      </div>
    </section>

    <section class="section section--light">
      <div class="container">
        <p class="section-label">Неліктен біз</p>
        <h2 class="section-title">Atamura Group-та жұмыс</h2>
        <div class="perks-grid">
          <div class="perk-card" v-for="perk in perks" :key="perk.title">
            <div class="perk-card__icon" v-html="perk.icon" />
            <h3 class="perk-card__title">{{ perk.title }}</h3>
            <p class="perk-card__desc">{{ perk.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">Ашық позициялар</p>
        <h2 class="section-title">Бос орындар</h2>

        <div v-if="jobs && jobs.length" class="vacancies-list">
          <NuxtLink
            v-for="job in jobs"
            :key="job.slug"
            :to="`/kz/careers/${job.slug}`"
            class="vacancy-row"
          >
            <div class="vacancy-row__left">
              <h3 class="vacancy-row__title">{{ job.title }}</h3>
              <div class="vacancy-row__tags">
                <span class="vacancy-tag">{{ job.department }}</span>
                <span class="vacancy-tag vacancy-tag--gray">{{ job.employment_type }}</span>
                <span v-if="job.salary_from || job.salary_to" class="vacancy-tag vacancy-tag--salary">
                  {{ formatSalary(job) }}
                </span>
              </div>
            </div>
            <div class="vacancy-row__right">
              <p class="vacancy-row__location">{{ job.city }}</p>
              <span class="vacancy-row__arrow">→</span>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="vacancies-empty">
          <p>Қазір ашық бос орындар жоқ. Жаңартуларды қадағалаңыз!</p>
        </div>
      </div>
    </section>

    <section class="section section--brand">
      <div class="container cta-row">
        <div>
          <h2 class="section-title">Қолайлы бос орын таппадыңыз ба?</h2>
          <p style="margin-top: var(--space-3); color: var(--color-gray-600);">Түйіндемені жіберіңіз — қолайлы позиция пайда болғанда қарастырамыз</p>
        </div>
        <a href="mailto:hr@atamuragroup.kz">
          <AppButton size="lg">Түйіндеме жіберу</AppButton>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { Job } from '~/types/api'

useSeoMeta({
  title: 'Бос орындар | Atamura Group',
  description: 'Atamura Group-тағы бос орындар — Алматыдағы құрылыс компаниясы. Кәсіпқойлар командасына қосылыңыз.',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/kz/careers` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/careers` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/careers` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/careers` },
  ],
})

const apiBase = useApiBase()

const { data: jobs } = await useAsyncData<Job[]>('jobs-kk',
  () => $fetch<Job[]>(`${apiBase}/jobs`),
  { server: false }
)

const formatSalary = (job: Job) => {
  const currency = job.salary_currency === 'KZT' ? '₸' : job.salary_currency
  if (job.salary_from && job.salary_to) return `${job.salary_from.toLocaleString()} – ${job.salary_to.toLocaleString()} ${currency}`
  if (job.salary_from) return `бастап ${job.salary_from.toLocaleString()} ${currency}`
  if (job.salary_to) return `дейін ${job.salary_to.toLocaleString()} ${currency}`
  return ''
}

const perks = [
  { title: 'Бәсекеге қабілетті жалақы', desc: 'Мөлдір төлем жүйесі, нәтиже бойынша тоқсандық бонустар.', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { title: 'Ресми жұмысқа орналасу', desc: 'ҚР ЕК толық сақталуы, ДМС, ақылы демалыс.', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
  { title: 'Даму', desc: 'Корпоративтік оқыту, кәсіби курстарды төлеу.', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
  { title: 'Достастық ұжым', desc: 'Жас ұжым, корпоративтік іс-шаралар, ашық мәдениет.', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
]
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
  min-height: 350px; padding-top: calc(72px + var(--space-12)); padding-bottom: var(--space-12); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); }
.page-header__sub {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.75);
}
.perks-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); margin-top: var(--space-10); }
.perk-card { padding: var(--space-6); background: var(--color-white); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
.perk-card__icon { color: var(--color-primary); margin-bottom: var(--space-4); }
.perk-card__title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-2); }
.perk-card__desc { font-size: var(--text-sm); color: var(--color-gray-600); line-height: var(--leading-relaxed); }
.vacancies-list { margin-top: var(--space-8); display: flex; flex-direction: column; border-top: 1px solid var(--border-color); }
.vacancy-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-6) 0; border-bottom: 1px solid var(--border-color); gap: var(--space-8); transition: background var(--transition-base); color: inherit; }
.vacancy-row:hover { background: var(--color-gray-100); padding-inline: var(--space-4); margin-inline: calc(-1 * var(--space-4)); border-radius: var(--radius-sm); }
.vacancy-row__left { flex: 1; }
.vacancy-row__title { font-size: var(--text-lg); font-weight: 600; color: var(--color-dark); margin-bottom: var(--space-2); }
.vacancy-row__tags { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.vacancy-tag { font-size: var(--text-xs); font-weight: 600; padding: 3px var(--space-3); border-radius: 2px; background: var(--color-primary-light); color: var(--color-primary); }
.vacancy-tag--gray { background: var(--color-gray-100); color: var(--color-gray-600); }
.vacancy-tag--salary { background: #e8f5e9; color: #2e7d32; }
.vacancy-row__right { display: flex; align-items: center; gap: var(--space-6); flex-shrink: 0; }
.vacancy-row__location { font-size: var(--text-sm); color: var(--color-gray-600); }
.vacancy-row__arrow { color: var(--color-primary); font-size: var(--text-lg); font-weight: 500; transition: transform var(--transition-base); }
.vacancy-row:hover .vacancy-row__arrow { transform: translateX(4px); }
.vacancies-empty { margin-top: var(--space-8); padding: var(--space-12); text-align: center; color: var(--color-gray-600); border: 1px dashed var(--border-color); border-radius: var(--radius-md); }
.cta-row { display: flex; justify-content: space-between; align-items: center; gap: var(--space-8); flex-wrap: wrap; }
@media (max-width: 1024px) { .perks-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .perks-grid { grid-template-columns: 1fr; } .vacancy-row { flex-direction: column; align-items: flex-start; gap: var(--space-3); } }
</style>
