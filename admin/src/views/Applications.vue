<template>
  <div>
    <div class="page-actions">
      <div class="page-title-wrap">
        <h1 class="page-title">{{ t('apps_title') }}</h1>
        <div class="live-indicator" :class="{ pulsing: !loading }">
          <span class="live-dot" />
        </div>
      </div>
      <div class="page-filters">
        <select v-model="filters.status" class="form-control filter-select">
          <option value="">{{ t('apps_all_status') }}</option>
          <option value="new">{{ t('status_new') }}</option>
          <option value="in_progress">{{ t('status_in_progress') }}</option>
          <option value="closed_won">{{ t('status_closed_won') }}</option>
          <option value="closed_lost">{{ t('status_closed_lost') }}</option>
        </select>
        <select v-model="filters.jk_slug" class="form-control filter-select">
          <option value="">{{ t('apps_all_jk') }}</option>
          <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
        </select>
        <select v-model="filters.type" class="form-control filter-select">
          <option value="">{{ t('apps_all_types') }}</option>
          <option value="application">{{ t('apps_type_flat') }}</option>
          <option value="quiz">{{ t('apps_type_quiz') }}</option>
          <option value="plan">{{ t('apps_type_plan') }}</option>
        </select>
        <button class="btn btn-secondary btn-icon" @click="() => fetchApplications()" :disabled="loading" :title="t('apps_refresh')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="loading ? 'animation: spin 0.7s linear infinite' : ''">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="newCount > 0" class="new-apps-banner">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
      {{ newCount }} {{ t('apps_new_arrived') }}
    </div>

    <div class="card">
      <template v-if="loading && !applications.length">
        <div v-for="i in 8" :key="i" class="skeleton-row">
          <div class="skeleton skeleton-cell" style="width:70px"></div>
          <div class="skeleton skeleton-cell" style="width:130px"></div>
          <div class="skeleton skeleton-cell" style="width:110px"></div>
          <div class="skeleton skeleton-cell" style="width:90px"></div>
          <div class="skeleton skeleton-cell" style="width:60px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:40px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:80px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:70px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="applications.length" class="table">
        <thead>
          <tr>
            <th>{{ t('apps_col_id') }}</th>
            <th>{{ t('apps_col_name') }}</th>
            <th>{{ t('apps_col_phone') }}</th>
            <th>{{ t('apps_col_jk') }}</th>
            <th>{{ t('apps_col_type') }}</th>
            <th>{{ t('apps_col_lang') }}</th>
            <th>{{ t('apps_col_status') }}</th>
            <th>{{ t('apps_col_date') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" :class="{ 'row--new': isNew(app) }">
            <td class="text-muted text-sm mono">{{ app.id.slice(0, 8) }}…</td>
            <td>
              <span class="app-name">{{ app.name }}</span>
            </td>
            <td>
              <a :href="`tel:${app.phone}`" class="phone-link">{{ app.phone }}</a>
            </td>
            <td>
              <span v-if="app.jk_slug" class="jk-label">{{ jkLabel(app.jk_slug) }}</span>
              <span v-else class="text-muted">—</span>
            </td>
            <td><span class="badge badge-gray">{{ typeLabel(app.type) }}</span></td>
            <td>
              <span v-if="app.lang" class="badge badge-gray">{{ app.lang.toUpperCase() }}</span>
              <span v-else class="text-muted">—</span>
            </td>
            <td><span :class="statusClass(app.status)">{{ statusLabel(app.status) }}</span></td>
            <td class="text-muted text-sm">{{ formatDate(app.created_at) }}</td>
            <td>
              <RouterLink :to="`/admin/applications/${app.id}`" class="btn btn-secondary btn-sm">
                {{ t('open') }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>{{ t('apps_empty') }}</p>
      </div>
    </div>

    <div v-if="total > limit" class="pagination mt-4">
      <button
        v-for="p in totalPages"
        :key="p"
        class="pagination-btn"
        :class="{ active: p === page }"
        @click="goToPage(p)"
      >{{ p }}</button>
      <span class="pagination-info">{{ t('apps_total') }}: {{ total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../api'
import { useI18n } from '../i18n'
import { useLabels } from '../utils/labels'
import type { Application } from '../types'

const { t } = useI18n()
const { jkLabel, typeLabel, statusLabel, statusClass, formatDate } = useLabels()

const applications = ref<Application[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(false)
const filters = ref({ status: '', jk_slug: '', type: '' })
const lastUpdated = ref<Date | null>(null)
const newCount = ref(0)
const seenIds = ref<Set<string>>(new Set())
let pollInterval: ReturnType<typeof setInterval> | null = null

const totalPages = computed(() => Math.ceil(total.value / limit))

const fetchApplications = async (silent = false) => {
  if (!silent) loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      limit: String(limit),
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.jk_slug && { jk_slug: filters.value.jk_slug }),
      ...(filters.value.type && { type: filters.value.type }),
    })
    const res = await api.get(`/admin/applications?${params}`)
    const incoming: Application[] = res.data.data || []

    if (seenIds.value.size > 0) {
      const fresh = incoming.filter(a => !seenIds.value.has(a.id))
      if (fresh.length > 0) newCount.value += fresh.length
    }
    incoming.forEach(a => seenIds.value.add(a.id))

    applications.value = incoming
    total.value = res.data.total || 0
    lastUpdated.value = new Date()
  } catch {}
  if (!silent) loading.value = false
}

const goToPage = (p: number) => {
  page.value = p
  newCount.value = 0
}

const isNew = (app: Application) => {
  const age = Date.now() - new Date(app.created_at).getTime()
  return age < 5 * 60 * 1000
}

onMounted(() => {
  fetchApplications()
  pollInterval = setInterval(() => fetchApplications(true), 30_000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

watch([page, filters], () => {
  newCount.value = 0
  fetchApplications()
}, { deep: true })

</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }

.page-title-wrap { display: flex; align-items: center; gap: 14px; }

.live-indicator { display: flex; align-items: center; gap: 6px; }
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-300);
  flex-shrink: 0;
  transition: background var(--transition);
}
.live-indicator.pulsing .live-dot {
  background: var(--success);
  animation: pulse-live 2.5s ease infinite;
}
@keyframes pulse-live {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.75); }
}

.filter-select { width: auto; min-width: 140px; font-size: 14px; padding: 8px 36px 8px 12px; }

.new-apps-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: var(--primary-light);
  color: var(--primary-dark);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  border: 1px solid rgba(0, 116, 132, 0.2);
}

.app-name { font-weight: 600; color: var(--dark); font-size: 14px; }
.phone-link { color: var(--primary); font-weight: 500; font-size: 14px; }
.phone-link:hover { text-decoration: underline; }
.jk-label { font-size: 14px; color: var(--gray-700); }
.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }

.row--new td { background: #f0fdf4; }
.row--new:hover td { background: #dcfce7 !important; }

.pagination-info { font-size: 13px; color: var(--gray-500); margin-left: 8px; }
</style>
