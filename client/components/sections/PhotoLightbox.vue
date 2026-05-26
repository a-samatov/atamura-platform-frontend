<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="modelValue"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="currentPhoto?.title || 'Просмотр фото'"
        @click.self="close"
      >
        <!-- Close -->
        <button class="lightbox__close" @click="close" aria-label="Закрыть">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Counter -->
        <div class="lightbox__counter" aria-live="polite">
          {{ currentIndex + 1 }} / {{ photos.length }}
        </div>

        <!-- Prev -->
        <button
          v-if="photos.length > 1"
          class="lightbox__nav lightbox__nav--prev"
          @click.stop="prev"
          aria-label="Предыдущее фото"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- Image area -->
        <div class="lightbox__stage" @click.self="close">
          <Transition :name="slideDirection" mode="out-in">
            <figure :key="currentIndex" class="lightbox__figure">
              <img
                :src="currentPhoto?.photo_url"
                :alt="currentPhoto?.title || 'Ход строительства'"
                class="lightbox__img"
                draggable="false"
              />
              <figcaption v-if="currentPhoto?.title || currentPhoto?.taken_at" class="lightbox__caption">
                <time v-if="currentPhoto?.taken_at" :datetime="currentPhoto.taken_at" class="lightbox__date">
                  {{ formatDate(currentPhoto.taken_at) }}
                </time>
                <span v-if="currentPhoto?.title" class="lightbox__title">{{ currentPhoto.title }}</span>
              </figcaption>
            </figure>
          </Transition>
        </div>

        <!-- Next -->
        <button
          v-if="photos.length > 1"
          class="lightbox__nav lightbox__nav--next"
          @click.stop="next"
          aria-label="Следующее фото"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <!-- Thumbnail strip -->
        <div v-if="photos.length > 1" class="lightbox__thumbs" role="list">
          <button
            v-for="(photo, i) in photos"
            :key="photo.id"
            class="lightbox__thumb"
            :class="{ 'lightbox__thumb--active': i === currentIndex }"
            @click.stop="goTo(i)"
            :aria-label="`Фото ${i + 1}`"
            :aria-current="i === currentIndex"
            role="listitem"
          >
            <img :src="photo.photo_url" :alt="photo.title || `Фото ${i + 1}`" loading="lazy" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ProgressPhoto } from '~/types/api'

const props = defineProps<{
  modelValue: boolean
  photos: ProgressPhoto[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const currentIndex = ref(props.initialIndex ?? 0)
const slideDirection = ref<'slide-left' | 'slide-right'>('slide-left')

const currentPhoto = computed(() => props.photos[currentIndex.value] ?? null)

watch(() => props.initialIndex, (val) => {
  if (val !== undefined) currentIndex.value = val
})

watch(() => props.modelValue, (val) => {
  if (val) {
    lockScroll()
  } else {
    unlockScroll()
  }
})

function lockScroll() {
  const scrollY = window.scrollY
  document.body.style.top = `-${scrollY}px`
  document.body.classList.add('lock-scrollbar')
  document.documentElement.classList.add('has-modal', 'lock-scrollbar')
}

function unlockScroll() {
  const top = document.body.style.top
  document.body.classList.remove('lock-scrollbar')
  document.body.style.top = ''
  document.documentElement.classList.remove('has-modal', 'lock-scrollbar')
  if (top) window.scrollTo(0, parseInt(top) * -1)
}

function close() {
  emit('update:modelValue', false)
}

function prev() {
  slideDirection.value = 'slide-right'
  currentIndex.value = (currentIndex.value - 1 + props.photos.length) % props.photos.length
}

function next() {
  slideDirection.value = 'slide-left'
  currentIndex.value = (currentIndex.value + 1) % props.photos.length
}

function goTo(i: number) {
  slideDirection.value = i > currentIndex.value ? 'slide-left' : 'slide-right'
  currentIndex.value = i
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
}

// Keyboard & touch
let touchStartX = 0

function onKeydown(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].screenX
}

function onTouchEnd(e: TouchEvent) {
  const delta = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(delta) < 40) return
  if (delta < 0) next()
  else prev()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  unlockScroll()
})
</script>

<style scoped>
/* ─── Overlay ─────────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(10, 10, 10, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

/* ─── Close ───────────────────────────────────────────── */
.lightbox__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, color 0.2s;
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

/* ─── Counter ─────────────────────────────────────────── */
.lightbox__counter {
  position: absolute;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
  pointer-events: none;
  z-index: 10;
}

/* ─── Stage ───────────────────────────────────────────── */
.lightbox__stage {
  flex: 1 1 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 80px 0;
  min-height: 0;
  overflow: hidden;
}

/* ─── Figure / Image ──────────────────────────────────── */
.lightbox__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  max-height: 100%;
  max-width: 100%;
}

.lightbox__img {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 220px);
  object-fit: contain;
  border-radius: var(--radius-md);
  user-select: none;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

/* ─── Caption ─────────────────────────────────────────── */
.lightbox__caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.lightbox__date {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.45);
}

.lightbox__title {
  font-size: var(--text-sm);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
}

/* ─── Nav arrows ──────────────────────────────────────── */
.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, color 0.2s;
  margin-top: -28px; /* offset thumbs */
}

.lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.lightbox__nav--prev { left: var(--space-4); }
.lightbox__nav--next { right: var(--space-4); }

/* ─── Thumbnail strip ─────────────────────────────────── */
.lightbox__thumbs {
  flex-shrink: 0;
  display: flex;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-4) var(--space-5);
  overflow-x: auto;
  scrollbar-width: none;
  max-width: 100%;
  align-items: center;
}

.lightbox__thumbs::-webkit-scrollbar { display: none; }

.lightbox__thumb {
  flex-shrink: 0;
  width: 56px;
  height: 42px;
  border-radius: 4px;
  overflow: hidden;
  opacity: 0.45;
  border: 2px solid transparent;
  cursor: pointer;
  transition: opacity 0.2s, border-color 0.2s, transform 0.2s;
}

.lightbox__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lightbox__thumb:hover {
  opacity: 0.7;
}

.lightbox__thumb--active {
  opacity: 1;
  border-color: var(--color-primary, #4a9d8f);
  transform: scale(1.08);
}

/* ─── Slide transitions ───────────────────────────────── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.slide-left-enter-from  { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(40px); }

/* ─── Overlay open/close transition ──────────────────── */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* ─── Mobile ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .lightbox__stage {
    padding: 56px 16px 0;
  }

  .lightbox__img {
    max-height: calc(100vh - 180px);
    border-radius: var(--radius-sm, 6px);
  }

  .lightbox__nav {
    width: 38px;
    height: 38px;
  }

  .lightbox__nav--prev { left: var(--space-2); }
  .lightbox__nav--next { right: var(--space-2); }

  .lightbox__thumb {
    width: 44px;
    height: 34px;
  }

  .lightbox__thumbs {
    padding: var(--space-3) var(--space-3) var(--space-4);
    gap: var(--space-2);
  }
}
</style>