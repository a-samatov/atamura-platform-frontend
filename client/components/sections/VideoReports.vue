<template>
  <div v-if="props.videos && props.videos.length" class="video-reports">
    <div class="video-reports__grid">
      <div
        v-for="video in visibleVideos"
        :key="video.id"
        class="video-card"
      >
        <div class="video-card__thumb" @click="openVideo(video)">
          <img
            :src="video.thumbnail || getYoutubeThumbnail(video.youtube_id)"
            :alt="video.title"
            loading="lazy"
            class="video-card__img"
          />
          <div class="video-card__play" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        <div class="video-card__info">
          <p class="video-card__title">{{ video.title }}</p>
          <time v-if="video.published_at" :datetime="video.published_at" class="video-card__date">
            {{ formatDate(video.published_at) }}
          </time>
        </div>
      </div>
    </div>

    <div v-if="props.videos.length > videosPerPage" class="video-reports__more">
      <button class="video-reports__more-btn" @click="videosExpanded = !videosExpanded">
        <span>{{ videosExpanded ? 'Свернуть' : `Смотреть все видео (${props.videos.length})` }}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
          :style="{ transform: videosExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>

    <div v-if="activeVideo" class="video-overlay" @click.self="closeVideo()">
      <div class="video-player">
        <button class="video-player__close" @click="closeVideo()" aria-label="Закрыть видео">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <iframe
          v-if="activeVideo.youtube_id"
          :src="`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1`"
          allow="autoplay; encrypted-media"
          allowfullscreen
          class="video-player__iframe"
          :title="activeVideo.title"
        />
        <video
          v-else-if="activeVideo.direct_url"
          :src="activeVideo.direct_url"
          controls
          autoplay
          class="video-player__iframe"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '~/types/api'

const activeVideo = ref<Video | null>(null)

// ─── Show-more logic ───────────────────────────────────
function getColumnsCount(): number {
  if (typeof window === 'undefined') return 4
  const w = window.innerWidth
  if (w >= 945) return 3
  if (w >= 581)  return 2
  if (w >= 521)  return 1
  return 1
}

const videosPerPage = ref(getColumnsCount())
const videosExpanded = ref(false)

function updateVideosPerPage() {
  videosPerPage.value = getColumnsCount()
}

const props = defineProps<{ videos: Video[] | null }>()

const visibleVideos = computed(() => {
  if (!props.videos) return []
  return videosExpanded.value
    ? props.videos
    : props.videos.slice(0, videosPerPage.value)
})

function openVideo(video: Video) {
  const scrollY = window.scrollY
  document.body.style.top = `-${scrollY}px`
  document.body.classList.add('lock-scrollbar')
  document.documentElement.classList.add('has-modal', 'lock-scrollbar')
  activeVideo.value = video
}

function closeVideo() {
  const top = document.body.style.top
  document.body.classList.remove('lock-scrollbar')
  document.body.style.top = ''
  document.documentElement.classList.remove('has-modal', 'lock-scrollbar')
  if (top) window.scrollTo(0, parseInt(top) * -1)
  activeVideo.value = null
}

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeVideo()
}
onMounted(() => {
  updateVideosPerPage()
  window.addEventListener('resize', updateVideosPerPage)
  window.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateVideosPerPage)
  window.removeEventListener('keydown', handleKey)
  document.body.classList.remove('lock-scrollbar')
  document.body.style.top = ''
  document.documentElement.classList.remove('has-modal')
})

function getYoutubeThumbnail(youtubeId?: string): string {
  if (!youtubeId) return '/images/video-placeholder.jpg'
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
}
</script>

<style scoped>
.video-reports__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--space-6);
}

.video-card__thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
  background-color: var(--color-gray-100);
}

.video-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.video-card__thumb:hover .video-card__img {
  transform: scale(1.03);
}

.video-card__play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(15,28,30,0.4);
  transition: background-color var(--transition-fast);
}

.video-card__info {
  padding: var(--space-3) 0;
}

.video-card__title {
  font-weight: 500;
  font-size: var(--text-sm);
  margin-bottom: var(--space-1);
}

.video-card__date {
  font-size: var(--text-xs);
  color: var(--color-gray-600);
}

.video-overlay {
  position: fixed;
  inset: 0;
  background-color: #434343e5;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.video-player {
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16/9;
}

.video-player__close {
  position: absolute;
  top: -40px;
  right: 0;
  padding: var(--space-2);
  z-index: 1;
}

.video-player__iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: var(--radius-md);
}

/* ─── Show more ──────────────────────────────────────── */
.video-reports__more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
}

.video-reports__more-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-dark);
  background: transparent;
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.video-reports__more-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(0, 0, 0, 0.02);
}

@media (max-width: 944px) {
  .video-reports__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media (max-width: 580px) {
  .video-reports__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .video-reports__grid {
    grid-template-columns: 1fr;
  }
}
</style>