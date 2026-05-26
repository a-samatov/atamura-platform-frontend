<template>
  <section class="section section--light about-section" aria-labelledby="about-heading">
    <div class="container">
      <div class="about-split">
        <div class="about-split__text reveal-left">
          <p class="section-label">{{ content.label }}</p>
          <h2 id="about-heading" class="section-title">{{ content.heading }}</h2>
          <p v-for="(para, i) in content.paragraphs" :key="i" class="about-split__para">{{ para }}</p>
          <div class="about-split__cta">
            <NuxtLink :to="content.ctaLink">
              <AppButton variant="outline">{{ content.cta }}</AppButton>
            </NuxtLink>
          </div>
        </div>
        <div class="about-split__img reveal-right">
          <img src="/images/atamura2.webp" :alt="content.imgAlt" loading="lazy" />
          <div class="about-split__badge">
            <span class="about-split__badge-num">8</span>
            <span class="about-split__badge-text" style="white-space: pre-line">{{ content.badgeText }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AboutContent } from '~/composables/useHomeContent'
defineProps<{ content: AboutContent }>()
</script>

<style scoped>
.about-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.about-split__text { display: flex; flex-direction: column; gap: var(--space-4); }

.about-split__para { font-size: var(--text-base); color: var(--color-gray-600); line-height: var(--leading-relaxed); }

.about-split__cta { margin-top: var(--space-2); }

.about-split__img {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;
  background-color: var(--color-gray-300);
}

.about-split__img img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
.about-split__img:hover img { transform: scale(1.04); }

.about-split__badge {
  position: absolute;
  bottom: var(--space-5);
  left: var(--space-5);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 116, 132, 0.4);
}

.about-split__badge-num { font-family: var(--font-heading); font-size: var(--text-4xl); font-weight: 700; line-height: 1; }
.about-split__badge-text { font-size: var(--text-xs); opacity: 0.85; text-align: center; line-height: 1.4; margin-top: 4px; }

@media (max-width: 1024px) { .about-split { grid-template-columns: 1fr; gap: var(--space-10); } }
</style>
