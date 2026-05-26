<template>
  <div v-if="reviews && reviews.length" class="reviews-wrap">
    <Transition name="page" mode="out-in">
      <div :key="page" class="reviews-grid">
        <article
          v-for="review in pageReviews"
          :key="review.id"
          class="review-card"
          itemscope
          itemtype="https://schema.org/Review"
        >
          <div v-if="review.rating" class="review-card__stars">
            <svg
              v-for="i in 5"
              :key="i"
              width="16" height="16" viewBox="0 0 24 24"
              :fill="i <= (review.rating ?? 0) ? '#d4a853' : 'none'"
              stroke="#d4a853" stroke-width="1.5"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>

          <blockquote class="review-card__text" itemprop="reviewBody">
            "{{ review.text }}"
          </blockquote>

          <div class="review-card__author">
            <div class="review-card__avatar">
              <img
                v-if="review.author_photo"
                :src="review.author_photo"
                :alt="review.author_name"
                width="40" height="40"
                loading="lazy"
              />
              <div v-else class="review-card__avatar-placeholder">
                {{ review.author_name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name" class="review-card__name">{{ review.author_name }}</span>
            </span>
          </div>
        </article>
      </div>
    </Transition>

    <div v-if="totalPages > 1" class="reviews-footer" role="group" aria-label="Навигация по отзывам">
      <button class="reviews-nav-btn" aria-label="Предыдущая группа" @click="manual(-1)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div class="reviews-dots">
        <button
          v-for="(idx, pos) in visibleDots"
          :key="idx"
          class="reviews-dot"
          :class="{
            'reviews-dot--active': idx === page,
            'reviews-dot--edge': totalPages > MAX_DOTS && (pos === 0 || pos === visibleDots.length - 1) && idx !== page,
          }"
          :aria-label="`Страница ${idx + 1}`"
          :aria-current="idx === page ? 'true' : undefined"
          @click="manualGoto(idx)"
        />
      </div>

      <button class="reviews-nav-btn" aria-label="Следующая группа" @click="manual(1)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/types/api'

const props = defineProps<{ reviews: Review[] | null }>()

function getColumnsCount(): number {
  if (typeof window === 'undefined') return 3
  const w = window.innerWidth
  if (w > 900) return 3
  if (w > 560) return 2
  return 1
}

const perPage = ref(getColumnsCount())
const page = ref(0)
const userPaused = ref(false)

function updatePerPage() {
  const cols = getColumnsCount()
  if (cols === perPage.value) return
  perPage.value = cols
  page.value = 0
}

const MAX_DOTS = 5

const totalPages = computed(() => Math.ceil((props.reviews?.length ?? 0) / perPage.value))
const pageReviews = computed(() => {
  const start = page.value * perPage.value
  return props.reviews?.slice(start, start + perPage.value) ?? []
})

const visibleDots = computed(() => {
  const total = totalPages.value
  if (total <= MAX_DOTS) return Array.from({ length: total }, (_, i) => i)
  const windowStart = Math.max(0, Math.min(page.value - Math.floor(MAX_DOTS / 2), total - MAX_DOTS))
  return Array.from({ length: MAX_DOTS }, (_, i) => windowStart + i)
})

function advance() {
  page.value = (page.value + 1) % totalPages.value
}

function manual(delta: number) {
  userPaused.value = true
  page.value = (page.value + delta + totalPages.value) % totalPages.value
}

function manualGoto(i: number) {
  userPaused.value = true
  page.value = i
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updatePerPage()
  window.addEventListener('resize', updatePerPage)
  if (totalPages.value <= 1) return
  timer = setInterval(() => {
    if (!userPaused.value) advance()
  }, 5500)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePerPage)
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.reviews-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* ── Grid: 3 → 2 → 1 columns ── */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  align-items: stretch;
}

@media (max-width: 900px) {
  .reviews-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .reviews-grid { grid-template-columns: 1fr; }
}

/* ── Card ── */
.review-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: var(--color-white);
}

.review-card__stars { display: flex; gap: 2px; }

.review-card__text {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-gray-900);
  flex: 1;
  font-style: normal;
}

.review-card__author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
  margin-top: auto;
}

.review-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.review-card__avatar img { width: 100%; height: 100%; object-fit: cover; }

.review-card__avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--text-base);
}

.review-card__name { font-weight: 500; font-size: var(--text-sm); }

/* ── Footer ── */
.reviews-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}

.reviews-dots { display: flex; gap: var(--space-2); align-items: center; }

.reviews-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  transition: background 0.3s ease, transform 0.3s ease;
  flex-shrink: 0;
}

.reviews-dot--active {
  background: var(--color-primary);
  transform: scale(1.4);
}

.reviews-dot--edge {
  transform: scale(0.65);
  opacity: 0.5;
}

.reviews-nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--color-gray-600);
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.reviews-nav-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

/* ── Page fade transition ── */
.page-enter-active { transition: opacity 0.4s ease; }
.page-leave-active { transition: opacity 0.2s ease; }
.page-enter-from  { opacity: 0; }
.page-leave-to    { opacity: 0; }
</style>
