<template>
  <div>
    <HeroSection :content="c.hero" />
    <BenefitsSection :content="c.benefits" />
    <AboutSection :content="c.about" />
    <JkSection :content="c.jk" />
    <StatsSection :content="c.stats" />
    <WhySection :content="c.why" />
    <ProcessSection :content="c.process" />
    <QuizSection :content="c.quiz" />
    <MapSection :content="c.map" />
    <PartnersSection :content="c.partners" />

    <section v-if="reviews?.length" class="section" aria-labelledby="reviews-heading">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">{{ c.reviews.label }}</p>
          <h2 id="reviews-heading" class="section-title">{{ c.reviews.heading }}</h2>
          <p class="section-desc">{{ c.reviews.desc }}</p>
        </div>
        <ReviewsSlider :reviews="reviews" />
      </div>
    </section>

    <section v-if="latestNews?.data?.length" class="section" aria-labelledby="news-heading">
      <div class="container">
        <div class="section-intro section-intro--row reveal">
          <div>
            <p class="section-label">{{ c.news.label }}</p>
            <h2 id="news-heading" class="section-title">{{ c.news.heading }}</h2>
          </div>
          <NuxtLink :to="c.news.allLink">
            <AppButton variant="outline" size="sm">{{ c.news.allText }}</AppButton>
          </NuxtLink>
        </div>
        <div class="news-grid">
          <NewsCard
            v-for="(article, i) in latestNews.data.slice(0, 3)"
            :key="article.id"
            :article="article"
            :class="`reveal reveal-delay-${i + 1}`"
          />
        </div>
      </div>
    </section>
  </div>
  <FloatContact />
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { NewsListResponse, Review } from '~/types/api'

const c = useHomeContent('ru')

useSeoMeta({
  title: 'Atamura Group — жилые комплексы в Алматы',
  description: 'Atamura Group — застройщик жилых комплексов бизнес-класса в Алматы. ЖК Атмосфера — современное жильё с развитой инфраструктурой. Ипотека, рассрочка.',
  ogTitle: 'Atamura Group — жилые комплексы в Алматы',
  ogDescription: 'Застройщик жилых комплексов бизнес-класса в Алматы. Прозрачные сроки, качественное строительство.',
  ogImage: '/images/og-main.jpg',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'canonical',  href: `${siteUrl}/` },
    { rel: 'alternate',  hreflang: 'ru',        href: `${siteUrl}/` },
    { rel: 'alternate',  hreflang: 'kk',        href: `${siteUrl}/kz` },
    { rel: 'alternate',  hreflang: 'en',        href: `${siteUrl}/en` },
    { rel: 'alternate',  hreflang: 'x-default', href: `${siteUrl}/` },
  ],
})

useScrollReveal()

const [, reviews, latestNews] = await Promise.all([
  useOptionalApi('/api/progress?jk=atmosfera'),
  useOptionalApi<Review[]>(`/api/reviews?lang=${c.reviews.lang}`),
  useOptionalApi<NewsListResponse>(`/api/news?lang=${c.news.lang}&limit=3`),
])
</script>
