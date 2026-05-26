<template>
  <div>
    <section class="page-header section--dark">
      <div class="container">
        <AppBreadcrumb :items="breadcrumbs" />
        <h1 class="page-header__title">Планировки Aqsai Resort</h1>
        <p class="page-header__sub">Выберите подходящий тип дома и оставьте заявку</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="controls-row">
          <div class="plans-tabs" role="tablist" aria-label="Типы планировок">
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
        </div>

        <p class="results-count">Найдено: {{ filteredPlans.length }} {{ pluralPlans(filteredPlans.length) }}</p>

        <div class="plans-grid">
          <div v-for="plan in filteredPlans" :key="plan.id" class="plan-card" role="article">
            <div class="plan-card__img-wrapper">
              <img :src="plan.imageUrl" :alt="`${plan.label}, этаж ${plan.floor}`" loading="lazy" class="plan-card__img" />
              <div class="plan-card__badge">Этаж {{ plan.floor }}</div>
            </div>
            <div class="plan-card__info">
              <div class="plan-card__head">
                <span class="plan-card__type">{{ plan.label }}</span>
                <span class="plan-card__tag">{{ plan.typeLabel }}</span>
              </div>
              <p class="plan-card__area">{{ plan.area }} м²</p>
              <div class="plan-card__details">
                <span>Комнат: {{ plan.rooms }}</span>
                <span>Санузел × {{ plan.bathrooms }}</span>
              </div>
              <AppButton
                variant="outline"
                size="sm"
                @click="uiStore.openModal('plan', { jkSlug: 'aqsai', planName: `${plan.label}, этаж ${plan.floor}` })"
              >
                Выбрать планировку
              </AppButton>
            </div>
          </div>
        </div>

        <div v-if="filteredPlans.length === 0" class="empty-state">
          <p>По выбранным параметрам планировки не найдены</p>
          <button class="reset-btn" @click="activeType = 'all'">Сбросить фильтр</button>
        </div>
      </div>
    </section>

    <section class="section section--brand">
      <div class="container cta-row">
        <div>
          <h2 class="section-title">Не нашли подходящую планировку?</h2>
          <p style="margin-top: var(--space-3); color: var(--color-gray-600);">Расскажите нам о требованиях — подберём лучший вариант</p>
        </div>
        <AppButton size="lg" @click="uiStore.openModal('quiz')">Пройти подбор</AppButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
useSeoMeta({
  title: 'Планировки Aqsai Resort | Atamura Group',
  description: 'Все планировки домов в Aqsai Resort: тип A, B, D. Выберите дом онлайн.',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/jk/aqsai/plans` }],
})

const uiStore = useUiStore()

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Aqsai Resort', href: '/jk/aqsai' },
  { label: 'Планировки' },
]

const planTypes = [
  { id: 'all', label: 'Все' },
  { id: 'typeA', label: 'Тип A' },
  { id: 'typeB', label: 'Тип B' },
  { id: 'typeD', label: 'Тип D' },
]

const activeType = ref('all')

const allPlans = [
  { id: 1, label: 'Тип A — 1 этаж', typeLabel: 'Тип A', rooms: 3, area: '120', bathrooms: 2, floor: 1, typeId: 'typeA', imageUrl: '/images/plans/aqsai/type-a-floor1.jpg' },
  { id: 2, label: 'Тип A — 2 этаж', typeLabel: 'Тип A', rooms: 2, area: '95', bathrooms: 1, floor: 2, typeId: 'typeA', imageUrl: '/images/plans/aqsai/type-a-floor2.jpg' },
  { id: 3, label: 'Тип B — 1 этаж', typeLabel: 'Тип B', rooms: 4, area: '145', bathrooms: 2, floor: 1, typeId: 'typeB', imageUrl: '/images/plans/aqsai/type-b-floor1.jpg' },
  { id: 4, label: 'Тип B — 2 этаж', typeLabel: 'Тип B', rooms: 3, area: '110', bathrooms: 2, floor: 2, typeId: 'typeB', imageUrl: '/images/plans/aqsai/type-b-floor2.jpg' },
  { id: 5, label: 'Тип D — 1 этаж', typeLabel: 'Тип D', rooms: 4, area: '160', bathrooms: 3, floor: 1, typeId: 'typeD', imageUrl: '/images/plans/aqsai/type-d-floor1.jpg' },
  { id: 6, label: 'Тип D — 2 этаж', typeLabel: 'Тип D', rooms: 3, area: '130', bathrooms: 2, floor: 2, typeId: 'typeD', imageUrl: '/images/plans/aqsai/type-d-floor2.jpg' },
]

const filteredPlans = computed(() => allPlans.filter(p => {
  if (activeType.value !== 'all' && p.typeId !== activeType.value) return false
  return true
}))

const pluralPlans = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 19) return 'планировок'
  const r = n % 10
  if (r === 1) return 'планировка'
  if (r >= 2 && r <= 4) return 'планировки'
  return 'планировок'
}
</script>

<style scoped>
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px; padding-bottom: var(--space-16); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); margin-top: var(--space-4); margin-bottom: var(--space-3); }
.page-header__sub { font-size: var(--text-lg); color: rgba(255,255,255,0.75); }
.controls-row { display: flex; align-items: center; gap: var(--space-8); flex-wrap: wrap; margin-bottom: var(--space-4); }
.plans-tabs { display: flex; gap: var(--space-2); }
.plans-tab { padding: var(--space-2) var(--space-5); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: var(--text-sm); font-weight: 500; cursor: pointer; background: none; color: var(--color-gray-600); transition: all var(--transition-base); }
.plans-tab.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.plans-tab:not(.active):hover { border-color: var(--color-primary); color: var(--color-primary); }
.results-count { font-size: var(--text-sm); color: var(--color-gray-600); margin-bottom: var(--space-8); }
.plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6); }
.plan-card { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; transition: box-shadow var(--transition-base); }
.plan-card:hover { box-shadow: var(--shadow-md); }
.plan-card__img-wrapper { position: relative; aspect-ratio: 4/3; background: var(--color-primary-light); }
.plan-card__img { width: 100%; height: 100%; object-fit: contain; padding: var(--space-4); }
.plan-card__badge { position: absolute; top: var(--space-3); right: var(--space-3); background: rgba(15,28,30,0.6); color: white; font-size: var(--text-xs); padding: 3px var(--space-2); border-radius: 2px; }
.plan-card__info { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
.plan-card__head { display: flex; justify-content: space-between; align-items: center; }
.plan-card__type { font-size: var(--text-sm); font-weight: 600; color: var(--color-dark); }
.plan-card__tag { font-size: var(--text-xs); background: var(--color-primary-light); color: var(--color-primary); padding: 2px var(--space-2); border-radius: 2px; font-weight: 600; }
.plan-card__area { font-family: var(--font-heading); font-size: var(--text-2xl); font-weight: 700; color: var(--color-dark); }
.plan-card__details { display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--color-gray-600); }
.empty-state { text-align: center; padding: var(--space-16); color: var(--color-gray-600); }
.reset-btn { margin-top: var(--space-4); padding: var(--space-2) var(--space-5); border: 1px solid var(--color-primary); color: var(--color-primary); border-radius: var(--radius-sm); background: none; cursor: pointer; font-size: var(--text-sm); }
.cta-row { display: flex; justify-content: space-between; align-items: center; gap: var(--space-8); flex-wrap: wrap; }
@media (max-width: 768px) { .controls-row { flex-direction: column; align-items: flex-start; } }
</style>
