<template>
  <div>
    <!-- ─── Page header ──────────────────────────────────────── -->
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Главная', href: '/' }, { label: 'Проекты' }]" />
        <h1 class="page-header__title">Жилые комплексы</h1>
        <p class="page-header__sub">Бизнес-класс с авторской архитектурой и развитой инфраструктурой</p>
      </div>
    </section>

    <!-- ─── ЖК список ─────────────────────────────────────── -->
    <section class="section jk-section" aria-labelledby="jk-heading">
      <div class="container">
        <div class="jk-grid">
          <article
            v-for="(jk, i) in filteredProjects"
            :key="jk.slug"
            class="jk-card reveal"
            :class="`reveal-delay-${(i % 3) + 1}`"
            itemscope
            itemtype="https://schema.org/Residence"
          >
            <NuxtLink :to="`/jk/${jk.slug}`" class="jk-card__link">
              <div class="jk-card__img-wrapper">
                <img
                  :src="jk.img"
                  :alt="`ЖК ${jk.name} — жилой комплекс в Алматы`"
                  loading="lazy"
                  class="jk-card__img"
                  itemprop="image"
                />
                <div class="jk-card__status" :class="`jk-card__status--${jk.statusType}`">{{ jk.status }}</div>
              </div>
              <div class="jk-card__body">
                <h3 class="jk-card__name" itemprop="name">{{ jk.name }}</h3>
                <p class="jk-card__meta">{{ jk.meta }}</p>
                <p class="jk-card__desc" itemprop="description">{{ jk.desc }}</p>
                <div class="jk-card__tags">
                  <span v-for="tag in jk.tags" :key="tag" class="jk-tag">{{ tag }}</span>
                </div>
                <span class="jk-card__cta">
                  Подробнее
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>

        <div v-if="filteredProjects.length === 0" class="jk-empty">
          <p>В выбранной категории проектов нет</p>
        </div>
      </div>
    </section>

    <!-- ─── CTA ──────────────────────────────────────────────── -->
    <section class="section section--brand projects-cta-section">
      <div class="container">
        <div class="projects-cta reveal">
          <h2 class="projects-cta__title">Подберём квартиру для вас</h2>
          <p class="projects-cta__desc">Наш менеджер проконсультирует по всем проектам и предложит наиболее подходящий вариант</p>
          <div class="projects-cta__actions">
            <AppButton size="lg" @click="uiStore.openModal('application')">Записаться на консультацию</AppButton>
          </div>
        </div>
      </div>
    </section>
  </div>
  <FloatContact />
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
useSeoMeta({
  title: 'Проекты | Atamura Group',
  description: 'Жилые комплексы Atamura Group — проекты бизнес-класса в Алматы. Атмосфера, Keruen, Aqsai Resort. Авторская архитектура, закрытая территория, панорамные виды.',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'canonical',  href: `${siteUrl}/projects` },
    { rel: 'alternate',  hreflang: 'ru',        href: `${siteUrl}/projects` },
    { rel: 'alternate',  hreflang: 'kk',        href: `${siteUrl}/kz/projects` },
    { rel: 'alternate',  hreflang: 'en',        href: `${siteUrl}/en/projects` },
    { rel: 'alternate',  hreflang: 'x-default', href: `${siteUrl}/projects` },
  ],
})

useScrollReveal()
const uiStore = useUiStore()

const filters = [
  { label: 'Все', value: 'all' },
  { label: 'Строится', value: 'under-construction' },
  { label: 'Сдан', value: 'completed' },
]
const activeFilter = ref('all')

const projects = [
  {
    slug: 'atmosfera',
    name: 'ЖК Атмосфера',
    img: '/images/atamura3.webp',
    status: 'Строится',
    statusType: 'under-construction',
    meta: 'г. Алматы · Бизнес-класс · Сдача IV кв. 2026',
    desc: 'Жилой комплекс с авторской архитектурой, закрытой территорией и панорамными видами на горы Алматы',
    tags: ['Панорамные виды', 'Закрытая территория'],
  },
  {
    slug: 'keruen',
    name: 'ЖК Keruen',
    img: '/images/keruen1.png',
    status: 'Строится',
    statusType: 'under-construction',
    meta: 'г. Алматы · Бизнес-класс · Сдача IV кв. 2026',
    desc: 'Жилой комплекс, созданный по современным архитектурным стандартам с акцентом на безопасность и комфорт',
    tags: ['Панорамные виды', 'Закрытая территория'],
  },
  {
    slug: 'aqsai',
    name: 'Aqsai Resort',
    img: '/images/aqsai1.jpeg',
    status: 'Строится',
    statusType: 'under-construction',
    meta: 'г. Алматы · Бизнес-класс · Сдача IV кв. 2026',
    desc: 'Современный малоэтажный микрорайон в предгорьях Алматы с полной инфраструктурой и центральным бульваром',
    tags: ['Паркинг', 'Закрытая территория'],
  },
]

const filteredProjects = computed(() =>
  activeFilter.value === 'all'
    ? projects
    : projects.filter(p => p.statusType === activeFilter.value),
)
</script>

<style scoped>
/* ─── Page header ─────────────────────────────────────────────── */
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px;
  padding-top: calc(72px + var(--space-16));
  padding-bottom: var(--space-16);
  color: var(--color-white);
}

.page-header__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page-header__title {
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
  color: var(--color-white);
}

.page-header__sub {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.75);
}

/* ─── Filter bar ──────────────────────────────────────────────── */
.filter-section {
  border-bottom: 1px solid var(--border-color);
  padding-block: var(--space-5);
}

.filter-bar {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* ─── JK section ──────────────────────────────────────────────── */
.jk-section { padding-block: var(--space-16); }

.jk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: var(--space-6); }

.jk-card { border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; transition: border-color var(--transition-fast), box-shadow var(--transition-normal); }
.jk-card:hover { border-color: var(--color-primary); box-shadow: 0 16px 48px rgba(0,116,132,0.1); }

.jk-card__link { display: block; color: inherit; text-decoration: none; }

.jk-card__img-wrapper { position: relative; aspect-ratio: 4/3; overflow: hidden; background-color: var(--color-gray-100); }
.jk-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
.jk-card:hover .jk-card__img { transform: scale(1.04); }

.jk-card__status { position: absolute; top: var(--space-3); left: var(--space-3); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.06em; padding: 4px var(--space-3); border-radius: 2px; background-color: var(--color-primary); color: var(--color-white); }
.jk-card__status--completed { background-color: var(--color-gray-600); }

.jk-card__body { padding: var(--space-6); }
.jk-card__name { font-size: var(--text-xl); font-weight: 600; margin-bottom: var(--space-2); }
.jk-card__meta { font-size: var(--text-xs); color: var(--color-gray-600); margin-bottom: var(--space-3); }
.jk-card__desc { font-size: var(--text-sm); color: var(--color-gray-600); line-height: var(--leading-relaxed); margin-bottom: var(--space-4); }
.jk-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4); }

.jk-tag { font-size: var(--text-xs); padding: 3px 10px; background-color: var(--color-primary-light); color: var(--color-primary); border-radius: 20px; font-weight: 500; }

.jk-card__cta { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-sm); font-weight: 500; color: var(--color-primary); transition: gap var(--transition-fast); }
.jk-card:hover .jk-card__cta { gap: var(--space-2); }

.jk-empty { text-align: center; padding: var(--space-16) 0; color: var(--color-gray-600); font-size: var(--text-base); }

/* ─── CTA ────────────────────────────────────────────────────── */
.projects-cta {
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.projects-cta__title {
  font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
  color: var(--color-gray-900);
  margin-bottom: var(--space-4);
}

.projects-cta__desc {
  font-size: var(--text-base);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
}

.projects-cta__actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Responsive ──────────────────────────────────────────────── */
@media (max-width: 640px) {
  .jk-grid { grid-template-columns: 1fr; }
  .projects-cta__actions { flex-direction: column; align-items: center; }
}
</style>