<template>
  <section class="section why-section" aria-labelledby="why-heading">
    <div class="container">
      <div class="section-intro reveal">
        <p class="section-label">{{ content.label }}</p>
        <h2 id="why-heading" class="section-title">{{ content.heading }}</h2>
      </div>
      <div class="why-grid">
        <div v-for="(card, i) in content.cards" :key="card.title" class="why-card reveal" :class="`reveal-delay-${i + 1}`">
          <div class="why-card__icon" v-html="WHY_ICONS[i]" />
          <h3 class="why-card__title">{{ card.title }}</h3>
          <p class="why-card__desc">{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WhyContent } from '~/composables/useHomeContent'

defineProps<{ content: WhyContent }>()

const WHY_ICONS = [
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
]
</script>

<style scoped>
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); margin-top: var(--space-10); }

.why-card {
  padding: var(--space-7);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal), transform var(--transition-normal);
}
.why-card:hover { border-color: var(--color-primary); box-shadow: 0 8px 32px rgba(0, 116, 132, 0.08); transform: translateY(-4px); }

.why-card__icon {
  width: 56px;
  height: 56px;
  background-color: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: var(--space-5);
  transition: background-color var(--transition-fast);
}
.why-card:hover .why-card__icon { background-color: var(--color-primary); color: white; }

.why-card__title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-3); color: var(--color-dark); }
.why-card__desc  { font-size: var(--text-sm); color: var(--color-gray-600); line-height: var(--leading-relaxed); }

@media (max-width: 1200px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .why-grid { grid-template-columns: 1fr; } }
</style>
