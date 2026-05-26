<template>
  <div>
    <section class="page-header section--dark">
      <div class="container">
        <AppBreadcrumb :items="breadcrumbs" />
        <h1 class="page-header__title">Планировки ЖК Атмосфера</h1>
        <p class="page-header__sub">Выберите подходящую квартиру и оставьте заявку</p>
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
          <div class="area-filter">
            <label class="filter-label">Площадь, м²:</label>
            <input
              v-model.number="areaMin"
              type="number"
              placeholder="от"
              min="30"
              max="150"
              class="area-input"
            />
            <span>—</span>
            <input
              v-model.number="areaMax"
              type="number"
              placeholder="до"
              min="30"
              max="200"
              class="area-input"
            />
          </div>
        </div>

        <p class="results-count">Найдено: {{ filteredPlans.length }} {{ pluralPlans(filteredPlans.length) }}</p>

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
                :alt="`Планировка ${plan.type}, ${plan.area} м²`"
                loading="lazy"
                class="plan-card__img"
              />
              <div class="plan-card__badge">{{ plan.floor }} эт.</div>
            </div>
            <div class="plan-card__info">
              <div class="plan-card__head">
                <span class="plan-card__type">{{ plan.type }}</span>
                <span class="plan-card__rooms">{{ plan.rooms }}-комн.</span>
              </div>
              <p class="plan-card__area">{{ plan.area }} м²</p>
              <div class="plan-card__details">
                <span>Кухня {{ plan.kitchen }} м²</span>
                <span>Санузел × {{ plan.bathrooms }}</span>
              </div>
              <AppButton
                variant="outline"
                size="sm"
                @click="uiStore.openModal('plan', { jkSlug: 'atmosfera', planName: `${plan.type}, ${plan.area} м²` })"
              >
                Выбрать планировку
              </AppButton>
            </div>
          </div>
        </div>

        <div v-if="filteredPlans.length === 0" class="empty-state">
          <p>По выбранным параметрам планировки не найдены</p>
          <button class="reset-btn" @click="resetFilters">Сбросить фильтры</button>
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
  title: 'Планировки ЖК Атмосфера | Atamura Group',
  description: 'Все планировки квартир в ЖК Атмосфера: студии, 1-, 2-, 3-комнатные. Площадь от 38 до 145 м². Выберите квартиру онлайн.',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/jk/atmosfera/plans` }],
})

const uiStore = useUiStore()

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'ЖК Атмосфера', href: '/jk/atmosfera' },
  { label: 'Планировки' },
]

const planTypes = [
  { id: 'all', label: 'Все' },
  { id: '1br', label: '1-комн.' },
  { id: '2br', label: '2-комн.' },
  { id: '3br', label: '3-комн.' },
]

const activeType = ref('all')
const areaMin = ref<number | null>(null)
const areaMax = ref<number | null>(null)

const allPlans = [
  { id: 1, type: '1-комнатная', rooms: 1, area: '38', kitchen: '12', bathrooms: 1, floor: '3–24', typeId: '1br', imageUrl: '/images/plans/1br-38.jpg' },
  { id: 2, type: '1-комнатная', rooms: 1, area: '42', kitchen: '14', bathrooms: 1, floor: '3–24', typeId: '1br', imageUrl: '/images/plans/1br-42.jpg' },
  { id: 3, type: '1-комнатная', rooms: 1, area: '45', kitchen: '15', bathrooms: 1, floor: '5–24', typeId: '1br', imageUrl: '/images/plans/1br-45.jpg' },
  { id: 4, type: '2-комнатная', rooms: 2, area: '62', kitchen: '16', bathrooms: 1, floor: '3–24', typeId: '2br', imageUrl: '/images/plans/2br-62.jpg' },
  { id: 5, type: '2-комнатная', rooms: 2, area: '74', kitchen: '18', bathrooms: 2, floor: '5–24', typeId: '2br', imageUrl: '/images/plans/2br-74.jpg' },
  { id: 6, type: '2-комнатная', rooms: 2, area: '80', kitchen: '20', bathrooms: 2, floor: '10–24', typeId: '2br', imageUrl: '/images/plans/2br-80.jpg' },
  { id: 7, type: '3-комнатная', rooms: 3, area: '95', kitchen: '20', bathrooms: 2, floor: '3–24', typeId: '3br', imageUrl: '/images/plans/3br-95.jpg' },
  { id: 8, type: '3-комнатная', rooms: 3, area: '115', kitchen: '24', bathrooms: 2, floor: '5–24', typeId: '3br', imageUrl: '/images/plans/3br-115.jpg' },
  { id: 9, type: '3-комнатная', rooms: 3, area: '130', kitchen: '28', bathrooms: 3, floor: '15–24', typeId: '3br', imageUrl: '/images/plans/3br-130.jpg' },
  { id: 10, type: '4-комнатная', rooms: 4, area: '145', kitchen: '32', bathrooms: 3, floor: '18–24', typeId: '4br', imageUrl: '/images/plans/4br-145.jpg' },
]

const filteredPlans = computed(() => allPlans.filter(p => {
  if (activeType.value !== 'all' && p.typeId !== activeType.value) return false
  const area = parseFloat(p.area)
  if (areaMin.value && area < areaMin.value) return false
  if (areaMax.value && area > areaMax.value) return false
  return true
}))

const resetFilters = () => {
  activeType.value = 'all'
  areaMin.value = null
  areaMax.value = null
}

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
.area-filter { display: flex; align-items: center; gap: var(--space-3); }
.filter-label { font-size: var(--text-sm); color: var(--color-gray-600); }
.area-input { width: 70px; padding: var(--space-2) var(--space-3); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: var(--text-sm); color: var(--color-dark); }
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
.plan-card__rooms { font-size: var(--text-xs); background: var(--color-primary-light); color: var(--color-primary); padding: 2px var(--space-2); border-radius: 2px; font-weight: 600; }
.plan-card__area { font-family: var(--font-heading); font-size: var(--text-2xl); font-weight: 700; color: var(--color-dark); }
.plan-card__details { display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--color-gray-600); }
.empty-state { text-align: center; padding: var(--space-16); color: var(--color-gray-600); }
.reset-btn { margin-top: var(--space-4); padding: var(--space-2) var(--space-5); border: 1px solid var(--color-primary); color: var(--color-primary); border-radius: var(--radius-sm); background: none; cursor: pointer; font-size: var(--text-sm); }
.cta-row { display: flex; justify-content: space-between; align-items: center; gap: var(--space-8); flex-wrap: wrap; }
@media (max-width: 768px) { .controls-row { flex-direction: column; align-items: flex-start; } }
</style>
