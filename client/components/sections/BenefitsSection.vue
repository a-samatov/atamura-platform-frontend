<template>
  <section id="benefits" class="section benefits-section" aria-label="Преимущества">
    <div class="container">
      <div class="benefits-grid">
        <div class="benefit reveal reveal-delay-1">
          <div class="benefit__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="benefit__body">
            <strong class="benefit__title">{{ content.items[0].title }}</strong>
            <p class="benefit__desc">{{ content.items[0].desc }}</p>
          </div>
        </div>
        <div class="benefit reveal reveal-delay-2">
          <div class="benefit__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="benefit__body">
            <strong class="benefit__title">{{ content.items[1].title }}</strong>
            <p class="benefit__desc">{{ content.items[1].desc }}</p>
          </div>
        </div>
        <div class="benefit reveal reveal-delay-3">
          <div class="benefit__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="benefit__body">
            <strong class="benefit__title">{{ content.items[2].title }}</strong>
            <p class="benefit__desc">{{ content.items[2].desc }}</p>
          </div>
        </div>
        <div class="benefit reveal reveal-delay-4">
          <div class="benefit__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div class="benefit__body">
            <strong class="benefit__title">{{ content.items[3].title }}</strong>
            <p class="benefit__desc">{{ content.items[3].desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BenefitsContent } from '~/composables/useHomeContent'
defineProps<{ content: BenefitsContent }>()
</script>

<style scoped>
.benefits-section { padding-block: var(--space-12); border-bottom: 1px solid var(--border-color); }

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}
.benefit:hover { background-color: var(--color-gray-100); }

.benefit__icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  background-color: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.benefit__title { display: block; font-size: var(--text-sm); font-weight: 600; color: var(--color-dark); margin-bottom: 4px; }
.benefit__desc  { font-size: var(--text-xs); color: var(--color-gray-600); line-height: var(--leading-relaxed); }

@media (max-width: 1200px) { .benefits-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .benefits-grid { grid-template-columns: 1fr; } }
</style>
