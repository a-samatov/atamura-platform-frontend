<template>
  <section ref="statsRef" class="section section--dark stats-section" aria-labelledby="stats-heading">
    <div class="container">
      <h2 id="stats-heading" class="stats-eyebrow reveal">{{ content.eyebrow }}</h2>
      <div class="stats-grid">
        <div class="stat-item reveal reveal-delay-1">
          <span class="stat-number">{{ statYears }}</span>
          <span class="stat-unit">{{ content.stats[0].unit }}</span>
          <span class="stat-label">{{ content.stats[0].label }}</span>
        </div>
        <div class="stat-item reveal reveal-delay-2">
          <span class="stat-number">{{ statObjects }}</span>
          <span class="stat-unit">{{ content.stats[1].unit }}</span>
          <span class="stat-label">{{ content.stats[1].label }}</span>
        </div>
        <div class="stat-item reveal reveal-delay-3">
          <span class="stat-number">{{ statFamilies }}</span>
          <span class="stat-unit">{{ content.stats[2].unit }}</span>
          <span class="stat-label">{{ content.stats[2].label }}</span>
        </div>
        <div class="stat-item reveal reveal-delay-4">
          <span class="stat-number">100</span>
          <span class="stat-unit">{{ content.stats[3].unit }}</span>
          <span class="stat-label">{{ content.stats[3].label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { StatsContent } from '~/composables/useHomeContent'

defineProps<{ content: StatsContent }>()

const statsRef    = ref<HTMLElement | null>(null)
const statYears   = ref(0)
const statObjects = ref(0)
const statFamilies = ref(0)

function countUp(target: Ref<number>, end: number, duration: number) {
  const start = performance.now()
  const step = (time: number) => {
    const t = Math.min((time - start) / duration, 1)
    target.value = Math.round((1 - (1 - t) ** 3) * end)
    if (t < 1) requestAnimationFrame(step)
    else target.value = end
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  if (!statsRef.value) return
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      countUp(statYears, 14, 1400)
      countUp(statObjects, 8, 900)
      countUp(statFamilies, 1200, 2000)
      obs.disconnect()
    }
  }, { threshold: 0.3 })
  obs.observe(statsRef.value)
})
</script>

<style scoped>
.stats-section { padding-block: var(--space-20); }

.stats-eyebrow {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-10);
  text-align: center;
  font-family: var(--font-heading);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.stat-item { display: flex; flex-direction: column; align-items: center; text-align: center; padding: var(--space-8) var(--space-6); background-color: var(--color-dark); gap: 4px; }

.stat-number { font-family: var(--font-heading); font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl)); font-weight: 700; color: var(--color-white); line-height: 1; min-width: 2ch; display: inline-block; }
.stat-unit   { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 600; color: var(--color-accent); line-height: 1; margin-bottom: var(--space-3); }
.stat-label  { font-size: var(--text-xs); color: rgba(255, 255, 255, 0.5); line-height: var(--leading-relaxed); max-width: 150px; }

@media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
