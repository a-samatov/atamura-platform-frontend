<template>
  <section class="section jk-section" id="projects" aria-labelledby="jk-heading">
    <div class="container">
      <div class="section-intro reveal">
        <p class="section-label">{{ content.label }}</p>
        <h2 id="jk-heading" class="section-title">{{ content.heading }}</h2>
        <p class="section-desc">{{ content.desc }}</p>
      </div>
      <div class="jk-grid">
        <article
          v-for="(project, i) in content.projects"
          :key="project.href"
          class="jk-card reveal"
          :class="`reveal-delay-${i + 1}`"
          itemscope
          itemtype="https://schema.org/Residence"
        >
          <NuxtLink :to="project.href" class="jk-card__link">
            <div class="jk-card__img-wrapper">
              <img
                :src="project.img"
                :alt="project.imgAlt"
                loading="lazy"
                class="jk-card__img"
                itemprop="image"
              />
              <div class="jk-card__status">{{ project.status }}</div>
            </div>
            <div class="jk-card__body">
              <h3 class="jk-card__name" itemprop="name">{{ project.name }}</h3>
              <p class="jk-card__meta">{{ project.meta }}</p>
              <p class="jk-card__desc" itemprop="description">{{ project.desc }}</p>
              <div class="jk-card__tags">
                <span v-for="tag in project.tags" :key="tag" class="jk-tag">{{ tag }}</span>
              </div>
              <span class="jk-card__cta">
                {{ content.ctaText }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { JkContent } from '~/composables/useHomeContent'
defineProps<{ content: JkContent }>()
</script>

<style scoped>
.jk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--space-6);
}

.jk-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal);
}
.jk-card:hover { border-color: var(--color-primary); box-shadow: 0 16px 48px rgba(0, 116, 132, 0.1); }

.jk-card__link { display: block; color: inherit; }

.jk-card__img-wrapper { position: relative; aspect-ratio: 4/3; overflow: hidden; background-color: var(--color-gray-100); }

.jk-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
.jk-card:hover .jk-card__img { transform: scale(1.04); }

.jk-card__status {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 4px var(--space-3);
  border-radius: 2px;
  background-color: var(--color-primary);
  color: var(--color-white);
}

.jk-card__body { padding: var(--space-6); }
.jk-card__name { font-size: var(--text-xl); font-weight: 600; margin-bottom: var(--space-2); }
.jk-card__meta { font-size: var(--text-xs); color: var(--color-gray-600); margin-bottom: var(--space-3); }
.jk-card__desc {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
  height: 70px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.jk-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4); }

.jk-tag { font-size: var(--text-xs); padding: 3px 10px; background-color: var(--color-primary-light); color: var(--color-primary); border-radius: 20px; font-weight: 500; }

.jk-card__cta { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-sm); font-weight: 500; color: var(--color-primary); transition: gap var(--transition-fast); }
.jk-card:hover .jk-card__cta { gap: var(--space-2); }

@media (max-width: 640px) { .jk-grid { grid-template-columns: 1fr; } }
</style>
