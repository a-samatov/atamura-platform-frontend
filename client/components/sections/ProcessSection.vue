<template>
  <section class="section section--light process-section" aria-labelledby="process-heading">
    <div class="container">
      <div class="section-intro reveal">
        <p class="section-label">{{ content.label }}</p>
        <h2 id="process-heading" class="section-title">{{ content.heading }}</h2>
        <p class="section-desc">{{ content.desc }}</p>
      </div>
      <div class="process-steps">
        <div
          v-for="(step, i) in content.steps"
          :key="step.title"
          class="process-step reveal"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="process-step__num">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="process-step__icon" v-html="PROCESS_ICONS[i]" />
          <h3 class="process-step__title">{{ step.title }}</h3>
          <p class="process-step__desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProcessContent } from '~/composables/useHomeContent'

defineProps<{ content: ProcessContent }>()

const PROCESS_ICONS = [
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.98 1.18 2 2 0 012.96 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
]
</script>

<style scoped>
.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: var(--space-12);
}

.process-step {
  padding: var(--space-8) var(--space-6) var(--space-6);
  border-top: 2px solid var(--border-color);
  position: relative;
  transition: border-color var(--transition-fast);
}
.process-step:hover { border-top-color: var(--color-primary); }

.process-step__num {
  position: absolute;
  top: -1px;
  left: var(--space-6);
  transform: translateY(-50%);
  background: var(--color-gray-100);
  padding: 0 var(--space-2);
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.process-step__icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: var(--space-5);
  margin-top: var(--space-6);
  transition: background var(--transition-fast), color var(--transition-fast);
}
.process-step:hover .process-step__icon { background: var(--color-primary); color: white; }

.process-step__title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-3); color: var(--color-gray-900); }
.process-step__desc  { font-size: var(--text-sm); color: var(--color-gray-600); line-height: var(--leading-relaxed); }

@media (max-width: 1024px) { .process-steps { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .process-steps { grid-template-columns: 1fr; } }
</style>
