<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom: 0">{{ t('reviews_title') }}</h1>
      <button class="btn btn-primary" @click="openCreate">{{ t('reviews_add') }}</button>
    </div>

    <div class="card">
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="skeleton-row">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:50%"></div>
          </div>
          <div class="skeleton skeleton-cell" style="width:60px"></div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:40%"></div>
          <div class="skeleton skeleton-cell" style="width:80px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:90px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="reviews.length" class="table">
        <thead>
          <tr>
            <th>{{ t('reviews_col_author') }}</th>
            <th>{{ t('reviews_col_jk') }}</th>
            <th>{{ t('reviews_col_lang') }}</th>
            <th>{{ t('reviews_col_rating') }}</th>
            <th>{{ t('reviews_col_text') }}</th>
            <th>{{ t('reviews_col_status') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in reviews" :key="review.id">
            <td class="font-semibold">{{ review.author_name }}</td>
            <td>{{ jkLabel(review.jk_slug) }}</td>
            <td><span class="badge badge-gray">{{ review.lang?.toUpperCase() }}</span></td>
            <td>
              <span class="stars">{{ '★'.repeat(review.rating || 0) }}{{ '☆'.repeat(5 - (review.rating || 0)) }}</span>
            </td>
            <td class="review-text">{{ review.text.slice(0, 80) }}{{ review.text.length > 80 ? '…' : '' }}</td>
            <td>
              <span v-if="review.published" class="badge badge-success">{{ t('published') }}</span>
              <span v-else class="badge badge-warning">{{ t('moderation') }}</span>
            </td>
            <td>
              <div class="flex gap-2">
                <button v-if="!review.published" class="btn btn-primary btn-sm" @click="publishReview(review)">{{ t('publish') }}</button>
                <button class="btn btn-secondary btn-sm" @click="openEdit(review)">{{ t('edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteReview(review)">{{ t('delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>{{ t('reviews_empty') }}</p>
        <button class="btn btn-primary" @click="openCreate">{{ t('add') }}</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ t('reviews_modal_title') }}</span>
            <button class="modal-close" @click="showModal = false" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" ref="formErrorRef" class="alert alert-danger mb-4">{{ formError }}</div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('author_name')}">{{ t('reviews_field_author') }}</label>
              <input v-model="newReview.author_name" class="form-control" :class="{'is-invalid': fe.has('author_name')}" placeholder="Иван Петров" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_lang') }}</label>
              <select v-model="newReview.lang" class="form-control">
                <option value="ru">RU — Русский</option>
                <option value="kk">KK — Қазақша</option>
                <option value="en">EN — English</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_jk') }}</label>
              <select v-model="newReview.jk_slug" class="form-control">
                <option value="">{{ t('jk_none') }}</option>
                <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_rating') }}</label>
              <select v-model.number="newReview.rating" class="form-control">
                <option :value="5">{{ t('reviews_rating_5') }}</option>
                <option :value="4">{{ t('reviews_rating_4') }}</option>
                <option :value="3">{{ t('reviews_rating_3') }}</option>
                <option :value="2">{{ t('reviews_rating_2') }}</option>
                <option :value="1">{{ t('reviews_rating_1') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_photo') }}</label>
              <FileUpload v-model="newReview.author_photo" accept="image/*" />
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('text')}">{{ t('reviews_field_text') }}</label>
              <textarea v-model="newReview.text" class="form-control" :class="{'is-invalid': fe.has('text')}" rows="4" placeholder="Текст отзыва..." />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="createReview">
              <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px" />
              <span v-else>{{ t('create') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showEditModal" class="modal-backdrop" @click.self="showEditModal = false">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ t('reviews_modal_edit_title') }}</span>
            <button class="modal-close" @click="showEditModal = false" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="editError" ref="editErrorRef" class="alert alert-danger mb-4">{{ editError }}</div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': editFe.has('author_name')}">{{ t('reviews_field_author') }}</label>
              <input v-model="editReview.author_name" class="form-control" :class="{'is-invalid': editFe.has('author_name')}" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_lang') }}</label>
              <select v-model="editReview.lang" class="form-control">
                <option value="ru">RU — Русский</option>
                <option value="kk">KK — Қазақша</option>
                <option value="en">EN — English</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_jk') }}</label>
              <select v-model="editReview.jk_slug" class="form-control">
                <option value="">{{ t('jk_none') }}</option>
                <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_rating') }}</label>
              <select v-model.number="editReview.rating" class="form-control">
                <option :value="5">{{ t('reviews_rating_5') }}</option>
                <option :value="4">{{ t('reviews_rating_4') }}</option>
                <option :value="3">{{ t('reviews_rating_3') }}</option>
                <option :value="2">{{ t('reviews_rating_2') }}</option>
                <option :value="1">{{ t('reviews_rating_1') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('reviews_field_photo') }}</label>
              <FileUpload :model-value="editReview.author_photo ?? ''" accept="image/*" @update:model-value="editReview.author_photo = $event || null" />
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': editFe.has('text')}">{{ t('reviews_field_text') }}</label>
              <textarea v-model="editReview.text" class="form-control" :class="{'is-invalid': editFe.has('text')}" rows="4" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showEditModal = false">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveEdit">
              <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px" />
              <span v-else>{{ t('save') }}</span>
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
import type { Review } from '../types'
import FileUpload from '../components/FileUpload.vue'

const { t } = useI18n()

const reviews = ref<Review[]>([])
const loading = ref(true)
const showModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const formError = ref('')
const fe = ref(new Set<string>())
const formErrorRef = ref<HTMLElement | null>(null)
const editError = ref('')
const editFe = ref(new Set<string>())
const editErrorRef = ref<HTMLElement | null>(null)

function showError(msg: string, fields: string[] = []) {
  formError.value = msg
  fe.value = new Set(fields)
  nextTick(() => formErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

function showEditError(msg: string, fields: string[] = []) {
  editError.value = msg
  editFe.value = new Set(fields)
  nextTick(() => editErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

const newReview = ref({ author_name: '', lang: 'ru' as 'ru'|'kk'|'en', jk_slug: '', rating: 5, text: '', author_photo: '' })
const editReview = ref({ id: '', author_name: '', lang: 'ru' as 'ru'|'kk'|'en', jk_slug: '' as string | null, rating: 5, text: '', author_photo: '' as string | null })

onMounted(async () => {
  try {
    const res = await api.get('/admin/reviews?limit=200')
    reviews.value = res.data || []
  } catch {}
  loading.value = false
})

const openCreate = () => {
  newReview.value = { author_name: '', lang: 'ru', jk_slug: '', rating: 5, text: '', author_photo: '' }
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const createReview = async () => {
  const errs = new Set<string>()
  if (!newReview.value.author_name) errs.add('author_name')
  if (!newReview.value.text) errs.add('text')
  if (errs.size > 0) { showError(t('error_required'), [...errs]); return }
  saving.value = true
  formError.value = ''
  fe.value = new Set()
  try {
    const payload = {
      author_name: newReview.value.author_name,
      lang: newReview.value.lang,
      jk_slug: newReview.value.jk_slug || null,
      rating: newReview.value.rating,
      text: newReview.value.text,
      author_photo: newReview.value.author_photo || null,
    }
    const res = await api.post('/admin/reviews', payload)
    reviews.value.unshift(res.data)
    showModal.value = false
  } catch {
    showError(t('error_create'))
  }
  saving.value = false
}

const openEdit = (review: Review) => {
  editReview.value = {
    id: review.id,
    author_name: review.author_name,
    lang: review.lang,
    jk_slug: review.jk_slug,
    rating: review.rating ?? 5,
    text: review.text,
    author_photo: review.author_photo,
  }
  editError.value = ''
  editFe.value = new Set()
  showEditModal.value = true
}

const saveEdit = async () => {
  const errs = new Set<string>()
  if (!editReview.value.author_name) errs.add('author_name')
  if (!editReview.value.text) errs.add('text')
  if (errs.size > 0) { showEditError(t('error_required'), [...errs]); return }
  saving.value = true
  editError.value = ''
  editFe.value = new Set()
  try {
    await api.patch(`/admin/reviews/${editReview.value.id}`, {
      author_name: editReview.value.author_name,
      lang: editReview.value.lang,
      jk_slug: editReview.value.jk_slug || null,
      rating: editReview.value.rating,
      text: editReview.value.text,
      author_photo: editReview.value.author_photo || null,
    })
    const idx = reviews.value.findIndex(r => r.id === editReview.value.id)
    if (idx !== -1) {
      reviews.value[idx] = { ...reviews.value[idx], ...editReview.value, jk_slug: editReview.value.jk_slug || null }
    }
    showEditModal.value = false
  } catch {
    showEditError(t('error_save'))
  }
  saving.value = false
}

const publishReview = async (review: Review) => {
  try {
    await api.patch(`/admin/reviews/${review.id}/publish`)
    review.published = true
  } catch {}
}

const deleteReview = async (review: Review) => {
  if (!confirm(`${t('reviews_delete_confirm')} «${review.author_name}»?`)) return
  try {
    await api.delete(`/admin/reviews/${review.id}`)
    reviews.value = reviews.value.filter(r => r.id !== review.id)
  } catch {}
}

const jkLabel = (slug: string | null) => slug ? ({ atmosfera: t('jk_atmosfera') }[slug] || slug) : t('jk_none')
</script>

<style scoped>
.stars { color: var(--accent); letter-spacing: 1px; }
.review-text { max-width: 300px; color: var(--gray-600); font-size: 12px; }
</style>
