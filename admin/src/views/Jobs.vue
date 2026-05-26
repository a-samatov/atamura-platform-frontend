<template>
  <div>
    <!-- Toolbar -->
    <div class="page-actions">
      <div>
        <h1 class="page-title" style="margin-bottom:0">{{ t('jobs_title') }}</h1>
      </div>
      <div class="page-filters">
        <select v-model="filterStatus" class="form-control filter-select">
          <option value="">{{ t('jobs_filter_all') }}</option>
          <option value="published">{{ t('jobs_filter_published') }}</option>
          <option value="draft">{{ t('jobs_filter_draft') }}</option>
          <option value="archived">{{ t('jobs_filter_archived') }}</option>
        </select>
        <select v-model="filterDept" class="form-control filter-select">
          <option value="">{{ t('jobs_col_dept') }}: все</option>
          <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
        </select>
        <button class="btn btn-primary" @click="openCreate">{{ t('jobs_add') }}</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <template v-if="loading && !jobs.length">
        <div v-for="i in 6" :key="i" class="skeleton-row">
          <div style="flex:2;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:65%"></div>
            <div class="skeleton skeleton-cell-sm" style="width:40%"></div>
          </div>
          <div class="skeleton skeleton-cell" style="width:90px"></div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:100px"></div>
          <div class="skeleton skeleton-cell" style="width:70px"></div>
          <div class="skeleton skeleton-cell" style="width:80px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:70px"></div>
          <div class="skeleton skeleton-cell" style="width:120px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>{{ t('jobs_col_title') }}</th>
            <th>{{ t('jobs_col_dept') }}</th>
            <th>{{ t('jobs_col_city') }}</th>
            <th>{{ t('jobs_col_type') }}</th>
            <th>{{ t('jobs_col_salary') }}</th>
            <th>{{ t('jobs_col_status') }}</th>
            <th>{{ t('jobs_col_date') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in filtered" :key="job.id">
            <td>
              <div class="job-title">{{ job.title }}</div>
              <div class="job-slug">/careers/{{ job.slug }}</div>
            </td>
            <td>{{ job.department }}</td>
            <td>{{ job.city }}</td>
            <td class="text-muted">{{ job.employment_type }}</td>
            <td class="text-muted">{{ formatSalary(job) }}</td>
            <td>
              <span class="badge" :class="statusBadge(job.status)">
                {{ t(`jobs_status_${job.status}`) }}
              </span>
            </td>
            <td class="text-muted text-sm">{{ formatDate(job.created_at) }}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" @click="openEdit(job)">{{ t('edit') }}</button>
                <button
                  v-if="job.status === 'draft'"
                  class="btn btn-success btn-sm"
                  @click="changeStatus(job, 'published')"
                  :title="t('jobs_status_published')"
                ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>
                <button
                  v-if="job.status === 'published'"
                  class="btn btn-secondary btn-sm"
                  @click="changeStatus(job, 'archived')"
                  :title="t('jobs_status_archived')"
                ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg></button>
                <button
                  v-if="job.status === 'archived'"
                  class="btn btn-secondary btn-sm"
                  @click="changeStatus(job, 'draft')"
                  title="Вернуть"
                ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg></button>
                <button class="btn btn-danger btn-sm" @click="confirmDelete(job)">{{ t('delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <div class="empty-state__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        </div>
        <p class="empty-state__title">{{ t('jobs_empty') }}</p>
        <p class="empty-state__desc">Нажмите «{{ t('jobs_add') }}» чтобы создать первую вакансию</p>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal modal-lg">
          <div class="modal-header">
            <span class="modal-title">{{ editingJob ? t('jobs_modal_edit') : t('jobs_modal_create') }}</span>
            <button class="modal-close" @click="closeModal" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>

          <div class="modal-body">
            <div v-if="saveError" ref="jobErrorRef" class="alert alert-danger mb-4">{{ saveError }}</div>

            <div class="grid-2">
              <!-- Title -->
              <div class="form-group" style="grid-column: 1/-1">
                <label class="form-label" :class="{'is-invalid': fieldErrors.has('title')}">{{ t('jobs_field_title') }}</label>
                <input v-model="form.title" class="form-control" :class="{'is-invalid': fieldErrors.has('title')}" @input="autoSlug" placeholder="Менеджер по продажам" />
              </div>

              <!-- Slug -->
              <div class="form-group" style="grid-column: 1/-1">
                <label class="form-label" :class="{'is-invalid': fieldErrors.has('slug')}">{{ t('jobs_field_slug') }}</label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix">/careers/</span>
                  <input v-model="form.slug" class="form-control form-control--no-left" :class="{'is-invalid': fieldErrors.has('slug')}" placeholder="sales-manager" />
                </div>
              </div>

              <!-- Department -->
              <div class="form-group">
                <label class="form-label" :class="{'is-invalid': fieldErrors.has('department')}">{{ t('jobs_field_dept') }}</label>
                <select v-model="form.department" class="form-control" :class="{'is-invalid': fieldErrors.has('department')}">
                  <option value="">— выберите —</option>
                  <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>

              <!-- City -->
              <div class="form-group">
                <label class="form-label">{{ t('jobs_field_city') }}</label>
                <select v-model="form.city" class="form-control">
                  <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <!-- Employment type -->
              <div class="form-group">
                <label class="form-label">{{ t('jobs_field_type') }}</label>
                <select v-model="form.employment_type" class="form-control">
                  <option v-for="et in employmentTypes" :key="et" :value="et">{{ et }}</option>
                </select>
              </div>

              <!-- Status -->
              <div class="form-group">
                <label class="form-label">{{ t('jobs_field_status') }}</label>
                <select v-model="form.status" class="form-control">
                  <option value="draft">{{ t('jobs_status_draft') }}</option>
                  <option value="published">{{ t('jobs_status_published') }}</option>
                  <option value="archived">{{ t('jobs_status_archived') }}</option>
                </select>
              </div>

              <!-- Salary from -->
              <div class="form-group">
                <label class="form-label">{{ t('jobs_field_salary_from') }}</label>
                <input v-model.number="form.salary_from" type="number" min="0" step="10000" class="form-control" placeholder="100 000" />
              </div>

              <!-- Salary to -->
              <div class="form-group">
                <label class="form-label">{{ t('jobs_field_salary_to') }}</label>
                <input v-model.number="form.salary_to" type="number" min="0" step="10000" class="form-control" placeholder="200 000" />
              </div>

              <!-- Currency -->
              <div class="form-group">
                <label class="form-label">{{ t('jobs_field_currency') }}</label>
                <select v-model="form.salary_currency" class="form-control">
                  <option value="KZT">KZT (₸)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <!-- Duties -->
            <div class="form-group">
              <label class="form-label">{{ t('jobs_field_duties') }}</label>
              <p class="form-hint">{{ t('jobs_field_duties_hint') }}</p>
              <textarea v-model="form.dutiesText" class="form-control" rows="6"
                placeholder="Консультировать клиентов по объектам&#10;Проводить показы квартир&#10;Вести CRM" />
            </div>

            <!-- Requirements -->
            <div class="form-group">
              <label class="form-label">{{ t('jobs_field_requirements') }}</label>
              <p class="form-hint">{{ t('jobs_field_requirements_hint') }}</p>
              <textarea v-model="form.requirementsText" class="form-control" rows="5"
                placeholder="Опыт в продажах от 1 года&#10;Грамотная речь&#10;Знание CRM" />
            </div>

            <!-- Conditions -->
            <div class="form-group">
              <label class="form-label">{{ t('jobs_field_conditions') }}</label>
              <p class="form-hint">{{ t('jobs_field_conditions_hint') }}</p>
              <textarea v-model="form.conditionsText" class="form-control" rows="5"
                placeholder="Оклад + KPI&#10;Официальное трудоустройство&#10;ДМС" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="save">
              <span v-if="saving" class="spinner" style="width:15px;height:15px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:white" />
              <span v-else>{{ t('save') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal modal-sm">
          <div class="modal-header">
            <span class="modal-title">{{ t('jobs_delete_confirm') }}</span>
            <button class="modal-close" @click="deleteTarget = null" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <p style="font-size:15px;color:var(--gray-700)">«{{ deleteTarget.title }}»</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="deleteTarget = null">{{ t('cancel') }}</button>
            <button class="btn btn-danger" :disabled="deleting" @click="doDelete">
              <span v-if="deleting" class="spinner" style="width:14px;height:14px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:white" />
              <span v-else>{{ t('delete') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from '../i18n'
import { api } from '../api'
import { buildSlug } from '../utils/labels'

interface Job {
  id: string
  slug: string
  title: string
  department: string
  city: string
  employment_type: string
  salary_from?: number
  salary_to?: number
  salary_currency: string
  duties: string[]
  requirements: string[]
  conditions: string[]
  status: string
  created_at: string
  updated_at: string
}

interface JobForm {
  title: string
  slug: string
  department: string
  city: string
  employment_type: string
  salary_from: number | null
  salary_to: number | null
  salary_currency: string
  dutiesText: string
  requirementsText: string
  conditionsText: string
  status: string
}

const { t } = useI18n()

const jobs = ref<Job[]>([])
const loading = ref(false)
const filterStatus = ref('')
const filterDept = ref('')

const showModal = ref(false)
const editingJob = ref<Job | null>(null)
const saving = ref(false)
const saveError = ref('')
const fieldErrors = ref(new Set<string>())
const jobErrorRef = ref<HTMLElement | null>(null)

const deleteTarget = ref<Job | null>(null)
const deleting = ref(false)

const departments = [
  'Продажи', 'Маркетинг', 'Строительство', 'Финансы',
  'HR', 'IT', 'Юридический', 'Администрация', 'Сервис', 'Другое',
]
const cities = ['Алматы', 'Астана', 'Шымкент', 'Актобе', 'Қарағанды']
const employmentTypes = ['Полная занятость', 'Частичная занятость', 'Удалённо', 'Стажировка']

const emptyForm = (): JobForm => ({
  title: '', slug: '', department: '', city: 'Алматы',
  employment_type: 'Полная занятость', salary_from: null, salary_to: null,
  salary_currency: 'KZT', dutiesText: '', requirementsText: '', conditionsText: '',
  status: 'draft',
})

const form = ref<JobForm>(emptyForm())

const filtered = computed(() => {
  let list = jobs.value
  if (filterStatus.value) list = list.filter(j => j.status === filterStatus.value)
  if (filterDept.value)   list = list.filter(j => j.department === filterDept.value)
  return list
})

async function fetchJobs() {
  loading.value = true
  try {
    const res = await api.get('/admin/jobs')
    jobs.value = res.data
  } finally {
    loading.value = false
  }
}

const textToLines = (text: string) => text.split('\n').map(l => l.trim()).filter(Boolean)
const linesToText = (lines: string[]) => lines.join('\n')

function autoSlug() {
  if (editingJob.value) return
  form.value.slug = buildSlug(form.value.title)
}

function openCreate() {
  editingJob.value = null
  form.value = emptyForm()
  saveError.value = ''
  fieldErrors.value = new Set()
  showModal.value = true
}

function openEdit(job: Job) {
  editingJob.value = job
  form.value = {
    title: job.title, slug: job.slug, department: job.department, city: job.city,
    employment_type: job.employment_type, salary_from: job.salary_from ?? null,
    salary_to: job.salary_to ?? null, salary_currency: job.salary_currency,
    dutiesText: linesToText(job.duties), requirementsText: linesToText(job.requirements),
    conditionsText: linesToText(job.conditions), status: job.status,
  }
  saveError.value = ''
  fieldErrors.value = new Set()
  showModal.value = true
}

function closeModal() { showModal.value = false; editingJob.value = null }

async function save() {
  const errs = new Set<string>()
  if (!form.value.title)      errs.add('title')
  if (!form.value.slug)       errs.add('slug')
  if (!form.value.department) errs.add('department')
  if (errs.size > 0) {
    fieldErrors.value = errs
    saveError.value = t('error_required')
    nextTick(() => jobErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
    return
  }
  fieldErrors.value = new Set()
  saving.value = true
  saveError.value = ''
  const payload = {
    title: form.value.title, slug: form.value.slug, department: form.value.department,
    city: form.value.city, employment_type: form.value.employment_type,
    salary_from: form.value.salary_from || undefined, salary_to: form.value.salary_to || undefined,
    salary_currency: form.value.salary_currency,
    duties: textToLines(form.value.dutiesText),
    requirements: textToLines(form.value.requirementsText),
    conditions: textToLines(form.value.conditionsText),
    status: form.value.status,
  }
  try {
    if (editingJob.value) {
      await api.put(`/admin/jobs/${editingJob.value.id}`, payload)
    } else {
      await api.post('/admin/jobs', payload)
    }
    closeModal(); await fetchJobs()
  } catch {
    saveError.value = t('error_save')
    nextTick(() => jobErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }
  saving.value = false
}

async function changeStatus(job: Job, status: string) {
  await api.put(`/admin/jobs/${job.id}`, { ...job, status })
  await fetchJobs()
}

function confirmDelete(job: Job) { deleteTarget.value = job }

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  await api.delete(`/admin/jobs/${deleteTarget.value.id}`)
  deleteTarget.value = null; deleting.value = false; await fetchJobs()
}

function formatSalary(job: Job) {
  const cur = job.salary_currency === 'KZT' ? '₸' : job.salary_currency
  if (job.salary_from && job.salary_to) return `${job.salary_from.toLocaleString()} – ${job.salary_to.toLocaleString()} ${cur}`
  if (job.salary_from) return `от ${job.salary_from.toLocaleString()} ${cur}`
  if (job.salary_to) return `до ${job.salary_to.toLocaleString()} ${cur}`
  return '—'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const statusBadge = (s: string) => ({
  published: 'badge-success',
  draft:     'badge-warning',
  archived:  'badge-gray',
}[s] || 'badge-gray')

onMounted(fetchJobs)
</script>

<style scoped>
.filter-select { width: auto; min-width: 150px; }
.job-title { font-weight: 600; font-size: 14.5px; color: var(--dark); }
.job-slug  { font-size: 12px; color: var(--gray-400); margin-top: 2px; font-family: 'SF Mono', monospace; }

.input-prefix-wrap { display: flex; }
.input-prefix {
  display: flex;
  align-items: center;
  padding: 0 13px;
  background: var(--gray-50);
  border: 1.5px solid var(--border);
  border-right: none;
  border-radius: var(--radius) 0 0 var(--radius);
  font-size: 13.5px;
  color: var(--gray-500);
  white-space: nowrap;
}
.form-control--no-left {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
