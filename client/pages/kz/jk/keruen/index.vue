<template>
  <div class="coming-soon-page">
    <div class="container coming-soon__container">

      <AppBreadcrumb :items="breadcrumbs" />

      <div class="coming-soon__content fade-in">
        <div class="coming-soon__badge">
          <span class="coming-soon__badge-dot" aria-hidden="true" />
          Жақында ашылады
        </div>

        <h1 class="coming-soon__title">
          <span class="coming-soon__accent">Керуен</span>
        </h1>

        <p class="coming-soon__desc">
          Бұл тұрғын үй кешенінің бетін дайындап жатырмыз. Жаңартуларды қадағалаңыз —
          жоспарлар, бағалар және сатып алу шарттары туралы барлық ақпарат жақында осында пайда болады.
        </p>

        <NuxtLink to="/kz/jk/atmosfera">
          <AppButton size="lg">
            Атмосфераға өту
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="margin-left: 6px;">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </AppButton>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
useSeoMeta({
  title: 'Керуен — жақында | Atamura Group',
  description: 'Керуен тұрғын үй кешенінің беті әзірленуде. Қазірдің өзінде Атмосфера-мен танысуға болады.',
  ogTitle: 'Керуен — жақында | Atamura Group',
  ogDescription: 'Керуен тұрғын үй кешенінің беті әзірленуде.',
  ogImage: '/images/og-main.jpg',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/kz/jk/keruen` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/jk/keruen` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/jk/keruen` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/jk/keruen` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/jk/keruen` },
  ],
})

const breadcrumbs = [
  { label: 'Басты бет', href: '/kz' },
  { label: 'Біздің жобалар', href: '/kz/#projects' },
  { label: 'Керуен' },
]
</script>

<style scoped>
.coming-soon-page {
  background-color: var(--color-dark);
  background-image: radial-gradient(ellipse at 60% 40%, rgba(0, 116, 132, 0.14) 0%, transparent 60%);
  min-height: 100dvh;
  display: flex;
  align-items: center;
  color: var(--color-white);
  padding: 120px 0 80px;
  overflow: hidden;
}

.coming-soon__container {
  max-width: 680px;
}

.coming-soon__badge {
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

.coming-soon__badge-dot {
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

.coming-soon__title {
  font-size: clamp(var(--text-4xl), 5.5vw, 64px);
  font-weight: 700;
  line-height: 1.0;
  color: var(--color-white);
  margin-bottom: var(--space-6);
}

.coming-soon__accent {
  color: var(--color-accent);
}

.coming-soon__desc {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.62);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-10);
  max-width: 520px;
}

@media (max-width: 640px) {
  .coming-soon-page { padding: 100px 0 60px; }
  .coming-soon__title { font-size: clamp(2rem, 10vw, 3rem); }
  .coming-soon__desc { font-size: var(--text-base); }
}
</style>