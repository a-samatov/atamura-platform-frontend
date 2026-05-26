<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom: 0">{{ t('docs_title') }}</h1>
      <button class="btn btn-primary" @click="openCreate">{{ t('docs_add') }}</button>
    </div>

    <div class="card">
      <!-- Skeleton -->
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="skeleton-row">
          <div style="flex:2;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:60%"></div>
          </div>
          <div class="skeleton skeleton-cell" style="width:100px"></div>
          <div class="skeleton skeleton-cell" style="width:90px"></div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:100px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="documents.length" class="table">
        <thead>
          <tr>
            <th>{{ t('docs_col_title') }}</th>
            <th>{{ t('docs_col_jk') }}</th>
            <th>{{ t('docs_col_type') }}</th>
            <th>{{ t('docs_col_date') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.id">
            <td>
              <a :href="doc.file_url" target="_blank" class="doc-link">{{ doc.title }}</a>
            </td>
            <td>{{ jkLabel(doc.jk_slug) }}</td>
            <td class="text-muted text-sm">{{ doc.doc_type || '—' }}</td>
            <td class="text-muted text-sm">{{ formatDate(doc.created_at) }}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" @click="openEdit(doc)">{{ t('edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteDoc(doc)">{{ t('delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>{{ t('docs_empty') }}</p>
        <button class="btn btn-primary" @click="openCreate">{{ t('add') }}</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ editingId ? t('edit') : t('docs_modal_title') }}</span>
            <button class="modal-close" @click="closeModal" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" ref="errorRef" class="alert alert-danger mb-4">{{ formError }}</div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('title')}">{{ t('docs_field_title') }}</label>
              <input v-model="form.title" class="form-control" :class="{'is-invalid': fe.has('title')}" placeholder="Разрешение на строительство" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('docs_field_jk') }}</label>
              <select v-model="form.jk_slug" class="form-control">
                <option value="">{{ t('jk_none') }}</option>
                <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('file_url')}">{{ t('docs_field_url') }}</label>
              <FileUpload v-model="form.file_url" accept=".pdf,.doc,.docx" :is-invalid="fe.has('file_url')" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('docs_field_type') }}</label>
              <input v-model="form.doc_type" class="form-control" :placeholder="t('docs_field_type_hint')" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveDoc">
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
import type { Document } from '../types'
import FileUpload from '../components/FileUpload.vue'

const { t } = useI18n()

const documents = ref<Document[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const fe = ref(new Set<string>())
const errorRef = ref<HTMLElement | null>(null)
const editingId = ref<string | null>(null)
const form = ref({ title: '', jk_slug: '', file_url: '', doc_type: '' })

function showError(msg: string, fields: string[] = []) {
  formError.value = msg
  fe.value = new Set(fields)
  nextTick(() => errorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

onMounted(async () => {
  try {
    const res = await api.get('/admin/documents?limit=200')
    documents.value = res.data || []
  } catch {}
  loading.value = false
})

const openCreate = () => {
  editingId.value = null
  form.value = { title: '', jk_slug: '', file_url: '', doc_type: '' }
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const openEdit = (doc: Document) => {
  editingId.value = doc.id
  form.value = {
    title: doc.title,
    jk_slug: doc.jk_slug || '',
    file_url: doc.file_url,
    doc_type: doc.doc_type || '',
  }
  formError.value = ''
  fe.value = new Set()
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const saveDoc = async () => {
  const errs = new Set<string>()
  if (!form.value.title) errs.add('title')
  if (!form.value.file_url) errs.add('file_url')
  if (errs.size > 0) { showError(t('error_required'), [...errs]); return }
  saving.value = true
  formError.value = ''
  fe.value = new Set()
  try {
    const payload = {
      title: form.value.title,
      jk_slug: form.value.jk_slug || null,
      file_url: form.value.file_url,
      doc_type: form.value.doc_type || null,
    }
    if (editingId.value) {
      const res = await api.put(`/admin/documents/${editingId.value}`, payload)
      const idx = documents.value.findIndex(d => d.id === editingId.value)
      if (idx !== -1) documents.value[idx] = res.data
    } else {
      const res = await api.post('/admin/documents', payload)
      documents.value.unshift(res.data)
    }
    showModal.value = false
  } catch {
    showError(t('error_save'))
  }
  saving.value = false
}

const deleteDoc = async (doc: Document) => {
  if (!confirm(`${t('docs_delete_confirm')} «${doc.title}»?`)) return
  try {
    await api.delete(`/admin/documents/${doc.id}`)
    documents.value = documents.value.filter(d => d.id !== doc.id)
  } catch {}
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')
const jkLabel = (slug: string | null) => slug ? ({ atmosfera: t('jk_atmosfera') }[slug] || slug) : t('jk_none')
</script>

<style scoped>
.doc-link { color: var(--primary); font-weight: 500; }
.doc-link:hover { text-decoration: underline; }
</style>
