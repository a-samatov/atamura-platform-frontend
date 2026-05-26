<template>
  <div v-if="photos && photos.length" class="progress-photos">
    <div class="progress-photos__grid">
      <figure
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="progress-photos__item"
        role="button"
        tabindex="0"
        :aria-label="`Открыть фото ${index + 1}: ${photo.title || 'Ход строительства'}`"
        @click="emit('open', index)"
        @keydown.enter="emit('open', index)"
        @keydown.space.prevent="emit('open', index)"
      >
        <img
          :src="photo.photo_url"
          :alt="photo.title || 'Ход строительства'"
          loading="lazy"
          class="progress-photos__img"
        />
        <!-- Zoom hint -->
        <div class="progress-photos__zoom" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <figcaption class="progress-photos__caption">
          <time v-if="photo.taken_at" :datetime="photo.taken_at" class="progress-photos__date">
            {{ formatDate(photo.taken_at) }}
          </time>
          <span v-if="photo.title" class="progress-photos__title">{{ photo.title }}</span>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProgressPhoto } from '~/types/api'

defineProps<{ photos: ProgressPhoto[] | null }>()

const emit = defineEmits<{
  open: [index: number]
}>()

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  })
}
</script>

<style scoped>
.progress-photos__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
}

.progress-photos__item {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.progress-photos__item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.progress-photos__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.progress-photos__item:hover .progress-photos__img {
  transform: scale(1.05);
}

/* Zoom icon */
.progress-photos__zoom {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.progress-photos__item:hover .progress-photos__zoom {
  opacity: 1;
  transform: scale(1);
}

/* Caption */
.progress-photos__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(to top, rgba(15,28,30,0.85) 0%, transparent 100%);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  transform: translateY(4px);
  transition: transform 0.2s ease;
}

.progress-photos__item:hover .progress-photos__caption {
  transform: translateY(0);
}

.progress-photos__date {
  font-size: var(--text-xs);
  color: rgba(255,255,255,0.65);
}

.progress-photos__title {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-white);
}

@media (max-width: 944px) {
  .progress-photos__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media (max-width: 580px) {
  .progress-photos__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 320px) {
  .progress-photos__grid {
    grid-template-columns: 1fr;
  }
}

/* On touch devices always show zoom hint */
@media (hover: none) {
  .progress-photos__zoom {
    opacity: 1;
    transform: scale(1);
  }
}
</style>