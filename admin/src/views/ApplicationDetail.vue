<template>
  <div>
    <div class="page-actions">
      <RouterLink to="/admin/applications" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        {{ t('back_to_applications') }}
      </RouterLink>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner" />
      <span>{{ t('apps_loading') }}</span>
    </div>

    <template v-else-if="app">
      <div class="detail-header">
        <div class="detail-header__info">
          <h1 class="page-title">{{ app.name }}</h1>
          <div class="detail-header__meta">
            <span :class="statusClass(app.status)">{{ statusLabel(app.status) }}</span>
            <span class="text-muted text-sm">{{ t('app_detail_created') }}: {{ formatDate(app.created_at) }}</span>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-main">
          <div class="card">
            <div class="card-header">
              <span class="card-title">{{ t('app_detail_title') }}</span>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <dt class="info-label">{{ t('app_detail_name') }}</dt>
                  <dd class="info-value">{{ app.name }}</dd>
                </div>
                <div class="info-item">
                  <dt class="info-label">{{ t('app_detail_phone') }}</dt>
                  <dd class="info-value">
                    <a :href="`tel:${app.phone}`" class="phone-link">{{ app.phone }}</a>
                  </dd>
                </div>
                <div class="info-item">
                  <dt class="info-label">{{ t('app_detail_jk') }}</dt>
                  <dd class="info-value">{{ jkLabel(app.jk_slug) }}</dd>
                </div>
                <div v-if="app.plan_name" class="info-item">
                  <dt class="info-label">{{ t('app_detail_plan') }}</dt>
                  <dd class="info-value">{{ app.plan_name }}</dd>
                </div>
                <div class="info-item">
                  <dt class="info-label">{{ t('app_detail_type') }}</dt>
                  <dd class="info-value"><span class="badge badge-gray">{{ typeLabel(app.type) }}</span></dd>
                </div>
                <div class="info-item">
                  <dt class="info-label">{{ t('app_detail_lang') }}</dt>
                  <dd class="info-value"><span class="badge badge-gray">{{ app.lang?.toUpperCase() || '—' }}</span></dd>
                </div>
                <div v-if="app.bank" class="info-item">
                  <dt class="info-label">{{ t('app_detail_bank') }}</dt>
                  <dd class="info-value"><span class="bank-badge">{{ app.bank }}</span></dd>
                </div>
                <div class="info-item info-item--full">
                  <dt class="info-label">{{ t('app_detail_source') }}</dt>
                  <dd class="info-value source-path">{{ app.source || '—' }}</dd>
                </div>
                <div class="info-item">
                  <dt class="info-label">{{ t('app_detail_updated') }}</dt>
                  <dd class="info-value text-muted">{{ formatDate(app.updated_at) }}</dd>
                </div>
              </div>

              <template v-if="app.message">
                <div class="section-divider" />
                <h3 class="section-title">{{ t('app_detail_message') }}</h3>
                <p class="message-text">{{ app.message }}</p>
              </template>

              <template v-if="app.quiz_answers && Object.keys(app.quiz_answers).length">
                <div class="section-divider" />
                <h3 class="section-title">{{ t('app_detail_quiz') }}</h3>
                <div class="quiz-grid">
                  <div v-for="(val, key) in app.quiz_answers" :key="key" class="quiz-item">
                    <dt class="info-label">{{ key }}</dt>
                    <dd class="info-value">{{ val }}</dd>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="detail-aside">
          <div class="card">
            <div class="card-header">
              <span class="card-title">{{ t('app_manage') }}</span>
            </div>
            <div class="card-body">
              <div v-if="saved" class="alert alert-success">{{ t('saved_ok') }}</div>
              <div v-if="saveError" class="alert alert-danger">{{ saveError }}</div>

              <div class="form-group mb-4">
                <label class="form-label">{{ t('app_status_label') }}</label>
                <select v-model="editStatus" class="form-control">
                  <option value="new">{{ t('status_new') }}</option>
                  <option value="in_progress">{{ t('status_in_progress') }}</option>
                  <option value="closed_won">{{ t('status_closed_won') }}</option>
                  <option value="closed_lost">{{ t('status_closed_lost') }}</option>
                </select>
              </div>

              <div class="form-group mb-4">
                <label class="form-label">{{ t('app_note_label') }}</label>
                <textarea
                  v-model="editNote"
                  class="form-control"
                  rows="5"
                  :placeholder="t('app_note_placeholder')"
                />
              </div>

              <button class="btn btn-primary w-full" :disabled="saving" @click="saveChanges">
                <span v-if="saving" class="spinner" style="width:15px;height:15px;border-width:2px;border-color:rgba(255,255,255,0.3);border-top-color:white" />
                <span v-else>{{ t('save') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <p>{{ t('app_not_found') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '../api'
import { useI18n } from '../i18n'
import { useLabels } from '../utils/labels'
import type { Application } from '../types'

const { t } = useI18n()
const { jkLabel, typeLabel, statusLabel, statusClass, formatDate } = useLabels()
const route = useRoute()
const app = ref<Application | null>(null)
const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')
const editStatus = ref('')
const editNote = ref('')

onMounted(async () => {
  try {
    const res = await api.get(`/admin/applications/${route.params.id}`)
    app.value = res.data
    editStatus.value = app.value!.status
    editNote.value = app.value!.manager_note || ''
  } catch {}
  loading.value = false
})

const saveChanges = async () => {
  saving.value = true
  saved.value = false
  saveError.value = ''
  try {
    await api.patch(`/admin/applications/${route.params.id}`, {
      status: editStatus.value,
      manager_note: editNote.value,
    })
    app.value!.status = editStatus.value as Application['status']
    app.value!.manager_note = editNote.value
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch {
    saveError.value = t('error_save')
  }
  saving.value = false
}

</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
  transition: color var(--transition);
}
.back-link:hover { color: var(--dark); }

.detail-header { margin-bottom: 24px; }
.detail-header__meta { display: flex; align-items: center; gap: 14px; margin-top: 10px; }

.detail-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 24px; }
.info-item { display: flex; flex-direction: column; gap: 4px; }
.info-item--full { grid-column: 1 / -1; }
.info-label { font-size: 12px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; }
.info-value { font-size: 14px; color: var(--dark); font-weight: 500; }

.phone-link { color: var(--primary); font-weight: 600; font-size: 15px; }
.phone-link:hover { text-decoration: underline; }

.bank-badge { display: inline-block; padding: 3px 10px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 13px; font-weight: 600; }
.source-path { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; color: var(--gray-600); word-break: break-all; }

.section-divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
.section-title { font-size: 14px; font-weight: 600; color: var(--dark); margin-bottom: 14px; }

.quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.quiz-item { display: flex; flex-direction: column; gap: 4px; }

.message-text {
  font-size: 14px;
  color: var(--dark);
  white-space: pre-line;
  line-height: 1.65;
  padding: 14px 16px;
  background: var(--gray-50);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.mb-4 { margin-bottom: 18px; }

@media (max-width: 1024px) { .detail-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } .quiz-grid { grid-template-columns: 1fr; } }
</style>
