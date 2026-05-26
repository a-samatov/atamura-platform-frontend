<template>
  <div class="jk-page">
    <!-- ─── Hero ────────────────────────────────────────────── -->
    <section class="jk-hero" aria-label="Атмосфера — басты баннер">
      <div class="container jk-hero__container">
        <div class="jk-hero__content fade-in">
          <AppBreadcrumb :items="breadcrumbs" />
          <div class="jk-hero__badge">
            <span class="jk-hero__badge-dot" aria-hidden="true" />
            Салынуда · IV&nbsp;тоқсан 2026 тапсыру
          </div>
          <h1 class="jk-hero__title">
            <span class="jk-hero__accent">Атмосфера</span>
          </h1>
          <p class="jk-hero__sub">Алматыдағы бизнес-класс тұрғын үй кешені</p>
          <div class="jk-hero__stats">
            <div v-for="spec in specs" :key="spec.label" class="jk-hero__stat">
              <span class="jk-hero__stat-value">{{ spec.value }}</span>
              <span class="jk-hero__stat-label">{{ spec.label }}</span>
            </div>
          </div>
          <div class="jk-hero__actions">
            <AppButton size="lg" @click="uiStore.openModal('application', { jkSlug: 'atmosfera' })">
              Өтінім қалдыру
            </AppButton>
            <a href="#plans" class="jk-hero__plans-link">
              Жоспарларды қарау
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="jk-hero__visual">
          <div class="jk-hero__img-frame">
            <img
              src="/images/atamura2.webp"
              alt="Атмосфера — Алматыдағы бизнес-класс тұрғын үй кешені"
              class="jk-hero__img"
              fetchpriority="high"
              loading="eager"
            />
            <div class="jk-hero__img-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Алматы, Алатау к.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── О проекте ─────────────────────────────────────── -->
    <section class="section about-project" aria-labelledby="about-heading">
      <div class="container">
        <div class="about-project__grid">
          <div class="about-project__text reveal-left">
            <p class="section-label">Жоба туралы</p>
            <h2 id="about-heading" class="section-title">Сапаны бағалайтындарға арналған ойластырылған тұрғын үй</h2>
            <p class="about-project__desc">
              Атмосфера — Алматыдағы 114 пәтерден тұратын 5 қабатты тұрғын үй кешені.
              Авторлық сәулет, жабық абаттандырылған аумақ, жерасты паркингі
              және Іле Алатауының тауларына панорамалық көріністер.
            </p>
            <p class="about-project__desc">
              Әрбір пәтер барынша табиғи жарықтандыруды және функционалды жоспарлауды
              ескере отырып жобаланған. Кілтке дейін таза қаптау — қалауыңызша.
            </p>
          </div>
          <div class="about-project__specs reveal-right">
            <div v-for="spec in specs" :key="spec.label" class="spec-item">
              <span class="spec-item__value">{{ spec.value }}</span>
              <span class="spec-item__label">{{ spec.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Преимущества ──────────────────────────────────── -->
    <section class="section section--light advantages-section" aria-labelledby="adv-heading">
      <div class="container">
        <p class="section-label">Неліктен Атмосфера</p>
        <h2 id="adv-heading" class="section-title reveal">Кешеннің артықшылықтары</h2>
        <div class="advantages-grid">
          <div
            v-for="(adv, index) in advantages"
            :key="adv.title"
            class="adv-card reveal-scale"
            :class="`reveal-delay-${Math.min(index + 1, 4)}`"
          >
            <div class="adv-card__icon" aria-hidden="true" v-html="adv.icon" />
            <h3 class="adv-card__title">{{ adv.title }}</h3>
            <p class="adv-card__desc">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Планировки ────────────────────────────────────── -->
    <section id="plans" class="section plans-section" aria-labelledby="plans-heading">
      <div class="container">
        <p class="section-label">Пәтерлер</p>
        <h2 id="plans-heading" class="section-title reveal">Жоспарлар</h2>
        <p class="plans-section__note reveal reveal-delay-1">Қолайлы жоспарды таңдаңыз — менеджер толық ақпаратпен хабарласады</p>

        <div class="plans-tabs reveal reveal-delay-2" role="tablist" aria-label="Жоспар түрлері">
          <button
            v-for="type in planTypes"
            :key="type.id"
            class="plans-tab"
            :class="{ active: activeType === type.id }"
            @click="activeType = type.id"
            role="tab"
            :aria-selected="activeType === type.id"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="plans-grid">
          <div
            v-for="plan in filteredPlans"
            :key="plan.id"
            class="plan-card"
            role="article"
          >
            <div class="plan-card__img-wrapper">
              <img
                :src="plan.imageUrl"
                :alt="`${plan.type} жоспары, ${plan.area} м²`"
                loading="lazy"
                class="plan-card__img"
              />
            </div>
            <div class="plan-card__info">
              <span class="plan-card__type">{{ plan.type }}</span>
              <p class="plan-card__area">{{ plan.area }} м²</p>
              <AppButton
                variant="outline"
                size="sm"
                @click="uiStore.openModal('plan', { jkSlug: 'atmosfera', planName: `${plan.type}, ${plan.area} м²` })"
              >
                Жоспарды таңдау
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Инфраструктура (карта) ────────────────────────── -->
    <section class="section section--light infra-section" aria-labelledby="infra-heading">
      <div class="container">
        <p class="section-label">Орналасуы</p>
        <h2 id="infra-heading" class="section-title reveal">Аудан инфрақұрылымы</h2>
        <div class="infra-content">
          <div class="infra-list reveal-left">
            <div v-for="item in infrastructure" :key="item.label" class="infra-item">
              <div class="infra-item__icon" aria-hidden="true" v-html="item.icon" />
              <div>
                <p class="infra-item__label">{{ item.label }}</p>
                <p class="infra-item__value">{{ item.value }}</p>
              </div>
            </div>
          </div>
          <div class="infra-map reveal-right">
            <ClientOnly>
              <YandexMap
                :markers="[{ lat: 43.328407, lng: 77.019172, title: '«Атмосфера»', description: 'Алматы қ., Нұршашқан шағынауданы, Алатау к.' }]"
                :center="{ lat: 43.328407, lng: 77.019172 }"
                :zoom="16"
                height="100%"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Ход строительства (опциональный) ──────────────── -->
    <section v-if="progressPhotos && progressPhotos.length" class="section" aria-labelledby="progress-heading" style="border-bottom: 1px solid #dcdcdc;">
      <div class="container">
        <p class="section-label">Ашықтық</p>
        <h2 id="progress-heading" class="section-title reveal">Құрылыс барысы</h2>

        <ProgressPhotos :photos="visiblePhotos" @open="openLightbox" />

        <div v-if="progressPhotos.length > photosPerPage" class="progress-photos__more">
          <button class="progress-photos__more-btn" @click="photosExpanded = !photosExpanded">
            <span>{{ photosExpanded ? 'Жию' : `Барлық фотоны қарау (${progressPhotos.length})` }}</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              :style="{ transform: photosExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ─── Photo Lightbox ────────────────────────────────── -->
    <PhotoLightbox
      v-if="progressPhotos && progressPhotos.length"
      v-model="lightboxOpen"
      :photos="progressPhotos"
      :initial-index="lightboxIndex"
    />

    <!-- ─── Видео (опциональное) ──────────────────────────── -->
    <section v-if="videos && videos.length" class="section section--light" aria-labelledby="videos-heading" style="background: white; border-bottom: 1px solid #dcdcdc;">
      <div class="container">
        <p class="section-label">Объект егжей-тегжейлі</p>
        <h2 id="videos-heading" class="section-title reveal">Бейне есептер</h2>
        <VideoReports :videos="videos" />
      </div>
    </section>

    <!-- ─── Документы (опциональные) ─────────────────────── -->
    <section v-if="documents && documents.length" class="section" aria-labelledby="docs-heading" style="border-bottom: 1px solid #dcdcdc;">
      <div class="container">
        <div class="docs-section">
          <div class="reveal-left">
            <p class="section-label">Қауіпсіздік</p>
            <h2 id="docs-heading" class="section-title">Құжаттар</h2>
            <p class="section-desc">Құрылысқа рұқсат және жобалық декларация</p>
          </div>
          <DocumentsList :documents="documents" class="reveal-right" />
        </div>
      </div>
    </section>

    <!-- ─── Ипотека ────────────────────────────────────────── -->
    <section class="section section--brand mortgage-section" aria-labelledby="mortgage-heading">
      <div class="container mortgage-section__inner">
        <div class="reveal-left">
          <p class="section-label">Қолжетімділік</p>
          <h2 id="mortgage-heading" class="section-title">Ипотека және бөліп төлеу</h2>
          <p class="section-desc">Қазақстанның жетекші банктерімен жұмыс жасаймыз. Бастапқы жарна 20%-дан.</p>
          <div class="mortgage-banks">
            <span v-for="bank in banks" :key="bank" class="mortgage-bank">{{ bank }}</span>
          </div>
        </div>
        <div class="reveal-right">
          <AppButton size="lg" @click="uiStore.openModal('application', { jkSlug: 'atmosfera' })">
            Ипотека бойынша кеңес
          </AppButton>
        </div>
      </div>
    </section>

    <!-- ─── Отзывы (опциональные) ─────────────────────────── -->
    <section v-if="reviews && reviews.length" class="section" aria-labelledby="reviews-heading">
      <div class="container">
        <p class="section-label">Тұрғындар пікірлері</p>
        <h2 id="reviews-heading" class="section-title reveal">Атмосфера туралы пікірлер</h2>
        <ReviewsSlider :reviews="reviews" />
      </div>
    </section>

    <!-- ─── Другие ЖК ──────────────────────────────────────── -->
    <section class="section section--light" aria-labelledby="other-jk-heading">
      <div class="container">
        <p class="section-label">Басқа жобалар</p>
        <h2 id="other-jk-heading" class="section-title reveal">Біздің жобалар</h2>
        <div class="other-jk">
          <div class="other-jk-card reveal-scale reveal-delay-1">
            <p class="other-jk-card__name">Keruen</p>
            <p class="other-jk-card__desc">Бизнес-класс тұрғын үй кешені · 24 қабат · IV тоқсан 2026 тапсыру</p>
            <NuxtLink to="/kz/jk/keruen"><AppButton variant="outline" size="sm">Толығырақ</AppButton></NuxtLink>
          </div>
          <div class="other-jk-card reveal-scale reveal-delay-2">
            <p class="other-jk-card__name">Aqsai Resort</p>
            <p class="other-jk-card__desc">Таунхаустар мен үйлер · Жабық кент · Табиғи атмосфера</p>
            <NuxtLink to="/kz/jk/aqsai"><AppButton variant="outline" size="sm">Толығырақ</AppButton></NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Форма заявки ───────────────────────────────────── -->
    <section id="contact" class="section contact-section" aria-labelledby="contact-heading">
      <div class="container">
        <div class="contact-section__inner">
          <div class="contact-section__text reveal-left">
            <p class="section-label">Бізбен байланысу</p>
            <h2 id="contact-heading" class="section-title">Өтінім қалдыру</h2>
            <p class="section-desc">Менеджер бір сағат ішінде хабарласып, барлық сұрақтарға жауап береді</p>
            <div class="contact-info">
              <a href="tel:+77273500000" class="contact-info__item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.98 1.18 2 2 0 012.96 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
                +7 (727) 350-00-00
              </a>
            </div>
            <div class="contact-mini-map">
              <ClientOnly>
                <YandexMap
                  :markers="jkMarkers"
                  :center="{ lat: 43.238949, lng: 76.889709 }"
                  :zoom="11"
                  height="100%"
                />
              </ClientOnly>
            </div>
          </div>
          <div class="contact-section__form reveal-right">
            <KzApplicationForm jk-slug="atmosfera" />
          </div>
        </div>
      </div>
    </section>
  </div>
  <FloatContact />
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { Video, ProgressPhoto, Review, Document } from '~/types/api'

useSeoMeta({
  title: 'Атмосфера — Алматыдағы пәтерлер | Atamura Group',
  description: 'Атмосфера — Алматыдағы бизнес-класс тұрғын үй кешені. 5 қабат, 114 пәтер, жерасты паркингі, жабық аумақ. Жетекші банктерден ипотека.',
  ogTitle: 'Алматыдағы Атмосфера | Atamura Group',
  ogDescription: 'Бизнес-класс тұрғын үй кешені. Студиядан 3-бөлмелі пәтерге дейін. IV тоқсан 2026 тапсыру.',
  ogImage: '/images/atmosfera-og.jpg',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/kz/jk/atmosfera` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/jk/atmosfera` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/jk/atmosfera` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/jk/atmosfera` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/jk/atmosfera` },
  ],
})

const uiStore = useUiStore()
useScrollReveal()

// ─── Photo Lightbox ────────────────────────────────────
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

// Считаем сколько колонок видно в сетке minmax(280px, 1fr),
// затем показываем 2 строки × кол-во колонок
function getColumnsCount(): number {
  if (typeof window === 'undefined') return 4
  const w = window.innerWidth
  if (w >= 945) return 4
  if (w >= 581)  return 3
  return 1
}

const photosPerPage = ref(getColumnsCount() * 2)
const photosExpanded = ref(false)

function updatePhotosPerPage() {
  photosPerPage.value = getColumnsCount() * 2
}

onMounted(() => {
  updatePhotosPerPage()
  window.addEventListener('resize', updatePhotosPerPage)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePhotosPerPage)
})

const visiblePhotos = computed(() => {
  if (!progressPhotos) return []
  return photosExpanded.value
    ? progressPhotos
    : progressPhotos.slice(0, photosPerPage.value)
})

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const breadcrumbs = [
  { label: 'Басты бет', href: '/' },
  { label: 'Біздің жобалар', href: '/#projects' },
  { label: 'Атмосфера' },
]

const specs = [
  { value: '5', label: 'қабат' },
  { value: '114', label: 'пәтер' },
  { value: 'IV 2026', label: 'тапсыру мерзімі' },
  { value: '2', label: 'паркинг деңгейі' },
]

const jkMarkers = [
  { lat: 43.255340, lng: 76.957853, title: 'Толе би сату бөлімі', description: 'Алматы қ., Толе би к., 12' },
  { lat: 43.328407, lng: 77.019172, title: 'Атмосфера сату бөлімі', description: 'Алматы қ., Нұршашқан шағынауданы, Алатау к.' },
  { lat: 43.182382, lng: 76.816449, title: 'Жандосов сату бөлімі', description: 'Жандосов к., 54 (UKO House ДО)' },
  { lat: 43.364445, lng: 77.124499, title: 'Аура сату бөлімі', description: 'Тұзусай а., Талғар ауданы, Сырым Датұлы к., 100а' },
  { lat: 43.429439, lng: 77.025712, title: 'Bravo сату бөлімі', description: 'Отечен Батыр а., Жансүгіров к., 109' },
  { lat: 43.392038, lng: 77.024813, title: 'Discovery сату бөлімі', description: 'Алматы облысы, Талғар ауданы, Жаңа Қуат шағынауданы' },
]

const advantages = [
  {
    title: 'Жабық аумақ',
    desc: 'Тәулік бойы бейнебақылау, кіру бақылауы, тұрғындарға арналған күзетілетін кіреберіс',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    title: 'Жерасты паркингі',
    desc: 'Пандустары, лифттері және желдету жүйесі бар екі деңгейлі паркинг',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  },
  {
    title: 'Авторлық сәулет',
    desc: 'Фасад Қазақстанның жетекші архитектуралық бюросы жасаған. Панорамалық шынылау',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    title: 'Панорамалық көріністер',
    desc: 'Жоғарғы қабаттардан Іле Алатауының тауларына көрініс ашылады',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  },
  {
    title: 'Балалар алаңы',
    desc: 'Жабық аумақтағы заманауи ойын кешені және спортпен айналысу аймағы',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
  },
  {
    title: 'Еуропалық сапа',
    desc: 'Otis лифттері, жетекші еуропалық өндірушілердің қаптау материалдары',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  },
]

const planTypes = [
  { id: 'all', label: 'Барлығы' },
  { id: '2k', label: '2-бөлмелі' },
  { id: '3k', label: '3-бөлмелі' },
]

const plans = [
  { id: '2k-1', type: '2-бөлмелі', area: 68, typeId: '2k', imageUrl: '/images/atmosfera/plans/2kom68.webp' },
  { id: '2k-2', type: '2-бөлмелі', area: 70, typeId: '2k', imageUrl: '/images/atmosfera/plans/2kom70.webp' },
  { id: '3k-1', type: '3-бөлмелі', area: 78, typeId: '3k', imageUrl: '/images/atmosfera/plans/3kom78.webp' },
  { id: '3k-2', type: '3-бөлмелі', area: 81, typeId: '3k', imageUrl: '/images/atmosfera/plans/3kom81.webp' },
  { id: '3k-3', type: '3-бөлмелі', area: 82, typeId: '3k', imageUrl: '/images/atmosfera/plans/3kom82.png' },
]

const activeType = ref('all')

const filteredPlans = computed(() => {
  if (activeType.value === 'all') return plans
  return plans.filter(p => p.typeId === activeType.value)
})

const infrastructure = [
  { label: 'Мектеп', value: '5 мин жаяу', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>` },
  { label: 'Балабақша', value: '3 мин жаяу', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>` },
  { label: 'Супермаркет', value: '2 мин жаяу', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>` },
  { label: 'Парк', value: '7 мин жаяу', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 22 9 18 14 18 17 8z"/><path d="M7 8C16 10 18.1 16.17 20.18 22 15 18 10 18 7 8z"/></svg>` },
  { label: 'Аялдама', value: '1 мин жаяу', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
]

const banks = ['Halyk Bank', 'Kaspi Bank', 'Jusan Bank', 'Freedom Bank']

const [progressPhotos, videos, reviews, documents] = await Promise.all([
  useOptionalApi<ProgressPhoto[]>('/api/progress?jk=atmosfera'),
  useOptionalApi<Video[]>('/api/videos?jk=atmosfera'),
  useOptionalApi<Review[]>('/api/reviews?jk=atmosfera&lang=kk'),
  useOptionalApi<Document[]>('/api/documents?jk=atmosfera'),
])
</script>

<style scoped>
/* ─── Hero ──────────────────────────────────────────────── */
.jk-hero {
  background-color: var(--color-dark);
  background-image: radial-gradient(ellipse at 68% 45%, rgba(0, 116, 132, 0.14) 0%, transparent 60%);
  padding: 96px 0 80px;
  color: var(--color-white);
  overflow: hidden;
}

.jk-hero__container {
  display: grid;
  grid-template-columns: 1fr 640px;
  gap: var(--space-16);
  align-items: center;
  padding-top: 2rem;
}

.jk-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-5);
  margin-top: var(--space-6);
}

.jk-hero__badge-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-accent);
  flex-shrink: 0;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.jk-hero__title {
  font-size: clamp(var(--text-4xl), 5.5vw, 64px);
  font-weight: 700;
  line-height: 1.0;
  color: var(--color-white);
  margin-bottom: var(--space-4);
}

.jk-hero__accent {
  color: var(--color-accent);
}

.jk-hero__sub {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.62);
  margin-bottom: 0;
  line-height: var(--leading-relaxed);
}

.jk-hero__stats {
  display: flex;
  align-items: flex-start;
  margin: var(--space-8) 0 var(--space-10);
  padding-top: var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.jk-hero__stat {
  padding-right: var(--space-8);
  margin-right: var(--space-8);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.jk-hero__stat:last-child {
  border-right: none;
  padding-right: 0;
  margin-right: 0;
}

.jk-hero__stat-value {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-white);
  line-height: 1;
}

.jk-hero__stat-label {
  display: block;
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.48);
  margin-top: 5px;
}

.jk-hero__actions {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.jk-hero__plans-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 2px;
  transition: color var(--transition-fast), gap var(--transition-fast);
}

.jk-hero__plans-link:hover {
  color: var(--color-white);
  gap: var(--space-3);
}

/* ─── Hero Image ─────────────────────────────────────────── */
.jk-hero__visual {
  position: relative;
  animation: fadeRight 0.72s ease 0.18s both;
  padding-right: 12px;
}

@keyframes fadeRight {
  from { opacity: 0; transform: translateX(36px); }
  to   { opacity: 1; transform: translateX(0); }
}

.jk-hero__img-frame {
  position: relative;
  aspect-ratio: 16 / 9;
}

.jk-hero__img-frame::before,
.jk-hero__img-frame::after {
  content: '';
  position: absolute;
  z-index: 2;
  pointer-events: none;
  width: 44px;
  height: 44px;
}

.jk-hero__img-frame::before {
  top: -10px;
  right: -10px;
  border-top: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}

.jk-hero__img-frame::after {
  bottom: -10px;
  left: -10px;
  border-bottom: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
}

.jk-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-sm);
}

.jk-hero__img-tag {
  position: absolute;
  bottom: var(--space-5);
  left: var(--space-5);
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(15, 28, 30, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 2px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.82);
  font-weight: 500;
}

/* ─── About project ──────────────────────────────────── */
.about-project__grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--space-16);
  align-items: start;
}

.about-project__text .section-title {
  margin-top: var(--space-2);
  margin-bottom: var(--space-5);
}

.about-project__desc {
  font-size: var(--text-base);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.about-project__specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--border-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.spec-item {
  background-color: var(--color-white);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.spec-item__value {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-primary);
}

.spec-item__label {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

/* ─── Advantages ─────────────────────────────────────── */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.adv-card {
  padding: var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
}

.adv-card__icon {
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.adv-card__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.adv-card__desc {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
}

/* ─── Plans ──────────────────────────────────────────── */
.plans-section__note {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  margin-bottom: var(--space-6);
}

.plans-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0;
}

.plans-tab {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-gray-600);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.plans-tab.active,
.plans-tab:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-4);
}

.plan-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.plan-card:hover {
  border-color: var(--color-primary);
}

.plan-card__img-wrapper {
  aspect-ratio: 1;
  background-color: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-card__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.plan-card__info {
  padding: var(--space-4);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.plan-card__type {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gray-600);
}

.plan-card__area {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-dark);
}

/* ─── Infrastructure ─────────────────────────────────── */
.infra-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-8);
  align-items: stretch;
}

.infra-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.infra-map {
  display: flex;
  flex-direction: column;
  min-height: 320px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.infra-map > :deep(*) {
  flex: 1 1 auto;
  height: 100% !important;
}

.infra-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}

.infra-item__icon {
  flex-shrink: 0;
  color: var(--color-primary);
}

.infra-item__label {
  font-size: var(--text-sm);
  font-weight: 500;
}

.infra-item__value {
  font-size: var(--text-xs);
  color: var(--color-gray-600);
}

/* ─── Documents section ──────────────────────────────── */
.docs-section {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-10);
  align-items: start;
}

/* ─── Mortgage ───────────────────────────────────────── */
.mortgage-section__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.mortgage-banks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.mortgage-bank {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-primary);
  border-radius: 2px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-primary);
}

/* ─── Other JK ───────────────────────────────────────── */
.other-jk { display: flex; gap: var(--space-6); flex-wrap: wrap; }
.other-jk-card { padding: var(--space-6); border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-3); min-width: 240px; flex: 1; }
.other-jk-card__name { font-weight: 600; }
.other-jk-card__desc { font-size: var(--text-sm); color: var(--color-gray-600); }

/* ─── Contact mini map ───────────────────────────────── */
.contact-mini-map {
  margin-top: var(--space-6);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
  flex: 1 1 auto;
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.contact-mini-map > :deep(*) {
  flex: 1 1 auto;
  height: 100% !important;
}

/* ─── Contact section ────────────────────────────────── */
.contact-section__inner {
  display: grid;
  grid-template-columns: 1fr minmax(0, 480px);
  gap: var(--space-16);
  align-items: stretch;
}

.contact-section__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.contact-info {
  margin-top: var(--space-6);
}

.contact-info__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-primary);
  transition: opacity var(--transition-fast);
}

.contact-info__item:hover {
  opacity: 0.8;
}

.contact-section__form {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.section-action {
  display: flex;
  justify-content: center;
  margin-top: var(--space-8);
}

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 1100px) {
  .jk-hero__container { grid-template-columns: 1fr 340px; gap: var(--space-12); }
  .jk-hero__stat { padding-right: var(--space-6); margin-right: var(--space-6); }
  .contact-section__inner { grid-template-columns: 1fr 380px; }
}

@media (max-width: 900px) {
  .jk-hero__container { grid-template-columns: 1fr; }
  .jk-hero__visual { order: -1; padding-right: 0 }
  .about-project__grid { grid-template-columns: 1fr; }
  .infra-content { grid-template-columns: 1fr; }
  .infra-map { min-height: 280px; }
  .docs-section { grid-template-columns: 1fr; }
  .contact-section__inner { grid-template-columns: 1fr; }
  .contact-mini-map { flex: none; min-height: 260px; max-height: 340px; }
  .advantages-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .jk-hero { padding: 80px 0 60px; }
  .jk-hero__stats { flex-wrap: wrap; row-gap: var(--space-4); }
  .jk-hero__stat { padding-right: var(--space-5); margin-right: var(--space-5); }
  .jk-hero__img-frame::before, .jk-hero__img-frame::after { display: none; }
  .advantages-grid { grid-template-columns: 1fr; }
  .plans-tabs { overflow-x: auto; scrollbar-width: none; }
  .mortgage-section__inner { flex-direction: column; align-items: flex-start; }
}

/* ─── Progress photos show-more ──────────────────────── */
.progress-photos__more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
}

.progress-photos__more-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-dark);
  background: transparent;
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.progress-photos__more-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(0, 0, 0, 0.02);
}
</style>