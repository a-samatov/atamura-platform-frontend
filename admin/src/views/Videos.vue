<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom: 0">{{ t('videos_title') }}</h1>
      <button class="btn btn-primary" @click="openCreate">{{ t('videos_add') }}</button>
    </div>

    <div class="card">
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="skeleton-row">
          <div class="skeleton skeleton-thumb"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:55%"></div>
            <div class="skeleton skeleton-cell-sm" style="width:30%"></div>
          </div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:60px"></div>
          <div class="skeleton skeleton-cell" style="width:120px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="videos.length" class="table">
        <thead>
          <tr>
            <th>{{ t('videos_col_thumb') }}</th>
            <th>{{ t('videos_col_title') }}</th>
            <th>{{ t('videos_col_jk') }}</th>
            <th>{{ t('videos_col_type') }}</th>
            <th>{{ t('videos_col_sort') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="video in videos" :key="video.id">
            <td>
              <div class="video-thumb">
                <img
                  v-if="video.thumbnail || video.youtube_id"
                  :src="video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`"
                  :alt="video.title"
                />
                <div v-else class="video-thumb--empty">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3.5l14 8.5-14 8.5V3.5z"/></svg>
                </div>
              </div>
            </td>
            <td class="font-semibold">{{ video.title }}</td>
            <td>{{ jkLabel(video.jk_slug) }}</td>
            <td><span class="badge badge-gray">{{ video.youtube_id ? t('videos_type_yt') : t('videos_type_direct') }}</span></td>
            <td class="text-muted text-sm">{{ video.sort_order }}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" @click="openEdit(video)">{{ t('edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteVideo(video)">{{ t('delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>{{ t('videos_empty') }}</p>
        <button class="btn btn-primary" @click="openCreate">{{ t('add') }}</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ editingId ? t('edit') : t('videos_modal_title') }}</span>
            <button class="modal-close" @click="closeModal" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" ref="errorRef" class="alert alert-danger mb-4">{{ formError }}</div>

            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('title')}">{{ t('videos_field_title') }}</label>
              <input v-model="form.title" class="form-control" :class="{'is-invalid': fe.has('title')}" placeholder="Видеоотчёт апрель 2026" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('videos_field_jk') }}</label>
              <select v-model="form.jk_slug" class="form-control">
                <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('source')}">{{ t('videos_field_youtube') }}</label>
              <input
                :value="youtubeRaw"
                class="form-control"
                :class="{'is-invalid': fe.has('source')}"
                :placeholder="t('videos_field_youtube_placeholder')"
                @input="onYoutubeInput"
              />
              <p class="form-hint">{{ t('videos_field_youtube_hint') }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('videos_field_url') }}</label>
              <input v-model="form.direct_url" type="url" class="form-control" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('videos_field_thumbnail') }}</label>
              <FileUpload v-model="form.thumbnail" accept="image/*" />
              <p class="form-hint">{{ t('videos_field_thumbnail_hint') }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('videos_field_sort') }}</label>
              <input v-model.number="form.sort_order" type="number" min="0" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveVideo">
              <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px" />
              <span v-else>{{ editingId ? t('save') : t('add') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { api } from '../api'
import { useI18n } from '../i18n'
import type { Video } from '../types'
import FileUpload from '../components/FileUpload.vue'

const { t } = useI18n()

const videos = ref<Video[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const fe = ref(new Set<string>())
const errorRef = ref<HTMLElement | null>(null)
const editingId = ref<string | null>(null)
const form = ref({ title: '', jk_slug: 'atmosfera', youtube_id: '', direct_url: '', thumbnail: '', sort_order: 0 })
const youtubeRaw = ref('')

function showError(msg: string, fields: string[] = []) {
  formError.value = msg
  fe.value = new Set(fields)
  nextTick(() => errorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

onMounted(async () => {
  try {
    const res = await api.get('/admin/videos?limit=200')
    videos.value = res.data || []
  } catch {}
  loading.value = false
})

const openCreate = () => {
  editingId.value = null
  form.value = { title: '', jk_slug: 'atmosfera', youtube_id: '', direct_url: '', thumbnail: '', sort_order: videos.value.length }
  youtubeRaw.value = ''
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const openEdit = (video: Video) => {
  editingId.value = video.id
  form.value = {
    title: video.title,
    jk_slug: video.jk_slug,
    youtube_id: video.youtube_id || '',
    direct_url: video.direct_url || '',
    thumbnail: video.thumbnail || '',
    sort_order: video.sort_order,
  }
  youtubeRaw.value = video.youtube_id
    ? `https://www.youtube.com/watch?v=${video.youtube_id}`
    : ''
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const saveVideo = async () => {
  if (!form.value.title) { showError(t('error_required'), ['title']); return }
  if (!form.value.youtube_id && !form.value.direct_url) { showError(t('videos_err_no_source'), ['source']); return }
  saving.value = true
  formError.value = ''
  fe.value = new Set()
  try {
    const payload = {
      title: form.value.title,
      jk_slug: form.value.jk_slug,
      youtube_id: form.value.youtube_id || null,
      direct_url: form.value.direct_url || null,
      thumbnail: form.value.thumbnail || null,
      sort_order: form.value.sort_order,
    }
    if (editingId.value) {
      const res = await api.put(`/admin/videos/${editingId.value}`, payload)
      const idx = videos.value.findIndex(v => v.id === editingId.value)
      if (idx !== -1) videos.value[idx] = res.data
    } else {
      const res = await api.post('/admin/videos', payload)
      videos.value.unshift(res.data)
    }
    showModal.value = false
  } catch {
    showError(t('error_save'))
  }
  saving.value = false
}

const deleteVideo = async (video: Video) => {
  if (!confirm(`${t('videos_delete_confirm')} «${video.title}»?`)) return
  try {
    await api.delete(`/admin/videos/${video.id}`)
    videos.value = videos.value.filter(v => v.id !== video.id)
  } catch {}
}

const jkLabel = (slug: string) => ({ atmosfera: t('jk_atmosfera') }[slug] || slug)

function extractYoutubeId(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) return m[1]
  }
  return s
}

function onYoutubeInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  youtubeRaw.value = raw
  form.value.youtube_id = extractYoutubeId(raw)
}
</script>

<style scoped>
.video-thumb { width: 80px; height: 45px; border-radius: 6px; overflow: hidden; background: var(--gray-100); flex-shrink: 0; }
.video-thumb img { width: 100%; height: 100%; object-fit: cover; }
.video-thumb--empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 16px; }
</style>
