<template>
  <div>
    <section class="page-header section--dark">
      <div class="container">
        <AppBreadcrumb :items="[{ label: 'Главная', href: '/' }, { label: 'Ипотека' }]" />
        <h1 class="page-header__title">Ипотека</h1>
        <p class="page-header__sub">Купите квартиру выгодно с нашими банками-партнёрами</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">Условия</p>
        <h2 class="section-title" style="margin-bottom: var(--space-10)">Банки-партнёры</h2>

        <div class="banks-grid">
          <div class="bank-card" v-for="bank in banks" :key="bank.name">
            <div class="bank-card__logo">{{ bank.name }}</div>
            <div class="bank-card__info">
              <div class="bank-stat">
                <span class="bank-stat__value">от {{ bank.rate }}%</span>
                <span class="bank-stat__label">годовых</span>
              </div>
              <div class="bank-stat">
                <span class="bank-stat__value">от {{ bank.down }}%</span>
                <span class="bank-stat__label">первый взнос</span>
              </div>
              <div class="bank-stat">
                <span class="bank-stat__value">до {{ bank.term }} лет</span>
                <span class="bank-stat__label">срок</span>
              </div>
            </div>
            <AppButton size="sm" @click="uiStore.openModal('application', { bank: bank.name })">Оставить заявку</AppButton>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--brand">
      <div class="container mortgage-cta">
        <div>
          <h2 class="section-title">Нужна консультация по ипотеке?</h2>
          <p style="margin-top: var(--space-3); color: var(--color-gray-600);">Наш менеджер подберёт лучшие условия под вашу ситуацию</p>
        </div>
        <AppButton size="lg" @click="uiStore.openModal('application')">
          Получить консультацию
        </AppButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
useSeoMeta({
  title: 'Ипотека | Atamura Group',
  description: 'Ипотека на квартиры в ЖК Атмосфера от Atamura Group. Банки-партнёры: Halyk, Kaspi, Jusan, Freedom. Ставка от 15,5% годовых.',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'canonical',  href: `${siteUrl}/mortgage` },
    { rel: 'alternate',  hreflang: 'ru',        href: `${siteUrl}/mortgage` },
    { rel: 'alternate',  hreflang: 'kk',        href: `${siteUrl}/kz/mortgage` },
    { rel: 'alternate',  hreflang: 'en',        href: `${siteUrl}/en/mortgage` },
    { rel: 'alternate',  hreflang: 'x-default', href: `${siteUrl}/mortgage` },
  ],
})

const uiStore = useUiStore()

const banks = [
  { name: 'Halyk Bank', rate: '15.5', down: '20', term: 30 },
  { name: 'Kaspi Bank', rate: '16', down: '20', term: 20 },
  { name: 'Jusan Bank', rate: '16.5', down: '25', term: 25 },
  { name: 'Freedom Bank', rate: '17', down: '20', term: 25 },
  { name: 'БЦК', rate: '16', down: '30', term: 20 },
]
</script>

<style scoped>
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px; padding-bottom: var(--space-16); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); margin-top: var(--space-4); margin-bottom: var(--space-3); }
.page-header__sub { font-size: var(--text-lg); color: rgba(255,255,255,0.75); }

.banks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }

.bank-card {
  padding: var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.bank-card__logo {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.bank-card__info { display: flex; gap: var(--space-4); }

.bank-stat { display: flex; flex-direction: column; gap: 2px; }

.bank-stat__value { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 600; color: var(--color-dark); }

.bank-stat__label { font-size: var(--text-xs); color: var(--color-gray-600); }

.mortgage-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

@media (max-width: 1024px) { .banks-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .banks-grid { grid-template-columns: 1fr; } }
</style>
