<template>
  <div>
    <section class="page-header section--dark">
      <div class="container">
        <AppBreadcrumb :items="breadcrumbs" />
        <h1 class="page-header__title">Ход строительства</h1>
        <p class="page-header__sub">Все фотоотчёты ЖК Керуен — без купюр</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="photos && photos.length">
          <div class="filter-bar">
            <button v-for="year in years" :key="year" class="filter-btn" :class="{ active: activeYear === year }" @click="activeYear = year">{{ year === 'all' ? 'Все годы' : year }}</button>
          </div>
          <div class="progress-grid">
            <div v-for="photo in filteredPhotos" :key="photo.id" class="progress-item" @click="openLightbox(photo)">
              <div class="progress-item__img-wrapper">
                <img :src="photo.image_url" :alt="photo.title" loading="lazy" class="progress-item__img" />
                <div class="progress-item__overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
              </div>
              <div class="progress-item__info">
                <p class="progress-item__title">{{ photo.title }}</p>
                <p class="progress-item__date">{{ formatDate(photo.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Фотографии хода строительства скоро будут размещены</p>
          <NuxtLink to="/kz/jk/keruen"><AppButton variant="outline" style="margin-top: var(--space-4)">Вернуться к ЖК</AppButton></NuxtLink>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="lightboxPhoto" class="lightbox" @click.self="lightboxPhoto = null">
        <button class="lightbox__close" @click="lightboxPhoto = null" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="lightbox__content">
          <img :src="lightboxPhoto.image_url" :alt="lightboxPhoto.title" class="lightbox__img" />
          <div class="lightbox__caption">
            <p class="lightbox__title">{{ lightboxPhoto.title }}</p>
            <p class="lightbox__date">{{ formatDate(lightboxPhoto.created_at) }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
import type { ProgressPhoto } from '~/types/api'

useSeoMeta({
  title: 'Ход строительства ЖК Керуен | Atamura Group',
  description: 'Фотоотчёты о ходе строительства ЖК Керуен в Алматы.',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [{ rel: 'canonical', href: `${siteUrl}/kz/jk/keruen/progress` }],
})

const breadcrumbs = [
  { label: 'Главная', href: '/kz' },
  { label: 'ЖК Керуен', href: '/kz/jk/keruen' },
  { label: 'Ход строительства' },
]

const photos = await useOptionalApi<ProgressPhoto[]>('/api/progress?jk=keruen&limit=100')
const lightboxPhoto = ref<ProgressPhoto | null>(null)
const activeYear = ref('all')

const years = computed(() => {
  if (!photos) return ['all']
  const ys = [...new Set((photos as ProgressPhoto[]).map(p => new Date(p.created_at).getFullYear().toString()))]
  return ['all', ...ys.sort().reverse()]
})

const filteredPhotos = computed(() => {
  if (!photos) return []
  if (activeYear.value === 'all') return photos as ProgressPhoto[]
  return (photos as ProgressPhoto[]).filter(p => new Date(p.created_at).getFullYear().toString() === activeYear.value)
})

const openLightbox = (photo: ProgressPhoto) => { lightboxPhoto.value = photo }
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })

onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') lightboxPhoto.value = null }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<style scoped>
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px; padding-bottom: var(--space-16); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); margin-top: var(--space-4); margin-bottom: var(--space-3); }
.page-header__sub { font-size: var(--text-lg); color: rgba(255,255,255,0.75); }
.filter-bar { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-8); }
.filter-btn { padding: var(--space-2) var(--space-5); border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: none; font-size: var(--text-sm); font-weight: 500; cursor: pointer; color: var(--color-gray-600); transition: all var(--transition-base); }
.filter-btn.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.filter-btn:not(.active):hover { border-color: var(--color-primary); color: var(--color-primary); }
.progress-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-5); }
.progress-item { cursor: pointer; }
.progress-item__img-wrapper { position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-md); background: var(--color-gray-100); }
.progress-item__img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
.progress-item:hover .progress-item__img { transform: scale(1.03); }
.progress-item__overlay { position: absolute; inset: 0; background: rgba(15,28,30,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity var(--transition-base); color: white; }
.progress-item:hover .progress-item__overlay { opacity: 1; }
.progress-item__info { padding: var(--space-3) 0; }
.progress-item__title { font-weight: 500; font-size: var(--text-sm); color: var(--color-dark); margin-bottom: 2px; }
.progress-item__date { font-size: var(--text-xs); color: var(--color-gray-600); }
.empty-state { text-align: center; padding: var(--space-20); color: var(--color-gray-600); }
.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: var(--z-modal); display: flex; align-items: center; justify-content: center; padding: var(--space-8); }
.lightbox__close { position: absolute; top: var(--space-6); right: var(--space-6); color: white; background: none; border: none; cursor: pointer; padding: var(--space-2); opacity: 0.7; transition: opacity var(--transition-base); }
.lightbox__close:hover { opacity: 1; }
.lightbox__content { max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
.lightbox__img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: var(--radius-sm); }
.lightbox__caption { text-align: center; }
.lightbox__title { color: white; font-size: var(--text-base); font-weight: 500; }
.lightbox__date { color: rgba(255,255,255,0.6); font-size: var(--text-sm); margin-top: 2px; }
</style>
