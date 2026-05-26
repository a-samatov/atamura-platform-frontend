<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom: 0">{{ t('progress_title') }}</h1>
      <button class="btn btn-primary" @click="openCreate">{{ t('progress_add') }}</button>
    </div>

    <div class="card">
      <!-- Skeleton grid -->
      <div v-if="loading" class="photos-grid skeleton-wrap">
        <div v-for="i in 8" :key="i" class="skeleton-card-wrap">
          <div class="skeleton skeleton-card"></div>
          <div style="padding:10px;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:70%"></div>
            <div class="skeleton skeleton-cell-sm" style="width:40%"></div>
          </div>
        </div>
      </div>

      <div v-else-if="photos.length" class="photos-grid">
        <div v-for="photo in photos" :key="photo.id" class="photo-card">
          <div class="photo-card__img">
            <img :src="photo.photo_url" :alt="photo.title || ''" loading="lazy" />
          </div>
          <div class="photo-card__info">
            <p class="photo-card__title">{{ photo.title || '—' }}</p>
            <p class="photo-card__date">#{{ photo.sort_order }}</p>
            <p v-if="photo.stage" class="photo-card__stage">{{ photo.stage }}</p>
            <p class="photo-card__jk">{{ jkLabel(photo.jk_slug) }}</p>
          </div>
          <div class="photo-card__actions">
            <button class="btn btn-secondary btn-sm flex-1" @click="openEdit(photo)">{{ t('edit') }}</button>
            <button class="btn btn-danger btn-sm flex-1" @click="deletePhoto(photo)">{{ t('delete') }}</button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>{{ t('progress_empty') }}</p>
        <button class="btn btn-primary" @click="openCreate">{{ t('add') }}</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ editingId ? t('edit') : t('progress_modal_title') }}</span>
            <button class="modal-close" @click="closeModal" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" ref="errorRef" class="alert alert-danger mb-4">{{ formError }}</div>
            <div class="form-group">
              <label class="form-label">{{ t('progress_field_title') }}</label>
              <input v-model="form.title" class="form-control" placeholder="Монолитные работы — 5 этаж" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('progress_field_jk') }}</label>
              <select v-model="form.jk_slug" class="form-control">
                <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('photo_url')}">{{ t('progress_field_url') }}</label>
              <FileUpload v-model="form.photo_url" accept="image/*" :is-invalid="fe.has('photo_url')" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('progress_field_sort') }}</label>
              <input v-model.number="form.sort_order" type="number" min="0" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('progress_field_stage') }}</label>
              <input v-model="form.stage" class="form-control" :placeholder="t('progress_field_stage_hint')" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('progress_field_desc') }}</label>
              <textarea v-model="form.description" class="form-control" rows="2" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="savePhoto">
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
import type { ProgressPhoto } from '../types'
import FileUpload from '../components/FileUpload.vue'

const { t } = useI18n()

const photos = ref<ProgressPhoto[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const fe = ref(new Set<string>())
const errorRef = ref<HTMLElement | null>(null)
const editingId = ref<string | null>(null)
const form = ref({ title: '', jk_slug: 'atmosfera', photo_url: '', sort_order: 0, stage: '', description: '' })

function showError(msg: string, fields: string[] = []) {
  formError.value = msg
  fe.value = new Set(fields)
  nextTick(() => errorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

onMounted(async () => {
  try {
    const res = await api.get('/admin/progress-photos?limit=200')
    photos.value = res.data || []
  } catch {}
  loading.value = false
})

const openCreate = () => {
  editingId.value = null
  form.value = { title: '', jk_slug: 'atmosfera', photo_url: '', sort_order: photos.value.length, stage: '', description: '' }
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const openEdit = (photo: ProgressPhoto) => {
  editingId.value = photo.id
  form.value = {
    title: photo.title || '',
    jk_slug: photo.jk_slug,
    photo_url: photo.photo_url,
    sort_order: photo.sort_order,
    stage: photo.stage || '',
    description: photo.description || '',
  }
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const savePhoto = async () => {
  if (!form.value.photo_url) { showError(t('error_required'), ['photo_url']); return }
  saving.value = true
  formError.value = ''
  fe.value = new Set()
  try {
    const payload = {
      title: form.value.title || null,
      jk_slug: form.value.jk_slug,
      photo_url: form.value.photo_url,
      sort_order: form.value.sort_order,
      stage: form.value.stage || null,
      description: form.value.description || null,
    }
    if (editingId.value) {
      const res = await api.put(`/admin/progress-photos/${editingId.value}`, payload)
      const idx = photos.value.findIndex(p => p.id === editingId.value)
      if (idx !== -1) photos.value[idx] = res.data
    } else {
      const res = await api.post('/admin/progress-photos', payload)
      photos.value.unshift(res.data)
    }
    showModal.value = false
  } catch {
    showError(t('error_save'))
  }
  saving.value = false
}

const deletePhoto = async (photo: ProgressPhoto) => {
  if (!confirm(`${t('progress_delete_confirm')} «${photo.title || photo.id}»?`)) return
  try {
    await api.delete(`/admin/progress-photos/${photo.id}`)
    photos.value = photos.value.filter(p => p.id !== photo.id)
  } catch {}
}

const jkLabel = (slug: string) => ({ atmosfera: t('jk_atmosfera') }[slug] || slug)
</script>

<style scoped>
.photos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; padding: 16px; }
.photo-card { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.photo-card__img { aspect-ratio: 4/3; overflow: hidden; background: var(--gray-100); }
.photo-card__img img { width: 100%; height: 100%; object-fit: cover; }
.photo-card__info { padding: 10px 10px 6px; }
.photo-card__title { font-size: 12px; font-weight: 600; color: var(--dark); margin-bottom: 2px; }
.photo-card__date, .photo-card__jk, .photo-card__stage { font-size: 11px; color: var(--gray-600); }
.photo-card__actions { display: flex; gap: 6px; padding: 0 10px 10px; }

.skeleton-card-wrap { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }

</style>
