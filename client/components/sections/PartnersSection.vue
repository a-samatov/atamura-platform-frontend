<template>
  <section class="section section--light partners-section" aria-labelledby="partners-heading">
    <div class="container">
      <div class="section-intro reveal">
        <p class="section-label">{{ content.label }}</p>
        <div class="section-title-up">
          <h2 id="partners-heading" class="section-title">{{ content.heading }}</h2>
          <NuxtLink :to="content.ctaLink">
            <AppButton variant="outline" size="sm">{{ content.ctaText }}</AppButton>
          </NuxtLink>
        </div>
        <p class="section-desc">{{ content.desc }}</p>
      </div>
      <div class="partners-list reveal" role="list" :aria-label="content.listLabel">
        <div v-for="bank in content.banks" :key="bank.name" class="partner-logo" role="listitem">
          <span>{{ bank.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PartnersContent } from '~/composables/useHomeContent'
defineProps<{ content: PartnersContent }>()
</script>

<style scoped>
.partners-list { display: flex; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-6); }

.partner-logo {
  padding: var(--space-4) var(--space-8);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  letter-spacing: 0.03em;
  transition: border-color var(--transition-fast), color var(--transition-fast);
  background: var(--color-white);
}
.partner-logo:hover { border-color: var(--color-primary); color: var(--color-primary); }
</style>
