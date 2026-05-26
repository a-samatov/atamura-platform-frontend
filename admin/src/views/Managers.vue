<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom: 0">{{ t('managers_title') }}</h1>
      <button class="btn btn-primary" @click="openCreate">{{ t('managers_add') }}</button>
    </div>

    <div class="card">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="skeleton-row">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:55%"></div>
            <div class="skeleton skeleton-cell-sm" style="width:40%"></div>
          </div>
          <div class="skeleton skeleton-cell" style="width:60px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:130px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="managers.length" class="table">
        <thead>
          <tr>
            <th>{{ t('managers_col_name') }}</th>
            <th>{{ t('managers_col_email') }}</th>
            <th>{{ t('managers_col_role') }}</th>
            <th>{{ t('managers_col_date') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in managers" :key="m.id">
            <td class="font-semibold">{{ m.name }}</td>
            <td class="text-muted">{{ m.email }}</td>
            <td><span class="badge" :class="roleBadge(m.role)">{{ m.role }}</span></td>
            <td class="text-muted text-sm">{{ formatDate(m.created_at) }}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" @click="openEdit(m)">{{ t('edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteManager(m)">{{ t('delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>{{ t('managers_empty') }}</p>
        <button class="btn btn-primary" @click="openCreate">{{ t('add') }}</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-backdrop" @click.self="showCreateModal = false">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ t('managers_modal_create') }}</span>
            <button class="modal-close" @click="showCreateModal = false" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="createError" ref="createErrorRef" class="alert alert-danger mb-4">{{ createError }}</div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': createFe.has('name')}">{{ t('managers_field_name') }}</label>
              <input v-model="createForm.name" class="form-control" :class="{'is-invalid': createFe.has('name')}" placeholder="Иван Петров" />
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': createFe.has('email')}">{{ t('managers_field_email') }}</label>
              <input v-model="createForm.email" type="email" class="form-control" :class="{'is-invalid': createFe.has('email')}" placeholder="manager@atamuragroup.kz" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('managers_field_role') }}</label>
              <select v-model="createForm.role" class="form-control">
                <option value="manager">{{ t('managers_role_manager') }}</option>
                <option value="admin">{{ t('managers_role_admin') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': createFe.has('password')}">{{ t('managers_field_password') }}</label>
              <input v-model="createForm.password" type="password" class="form-control" :class="{'is-invalid': createFe.has('password')}" />
              <p class="form-hint">{{ t('managers_field_password_hint') }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showCreateModal = false">{{ t('cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving" @click="createManager">
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
            <span class="modal-title">{{ t('managers_modal_edit') }}</span>
            <button class="modal-close" @click="showEditModal = false" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <div class="modal-body">
            <div v-if="editError" ref="editErrorRef" class="alert alert-danger mb-4">{{ editError }}</div>
            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': editFe.has('name')}">{{ t('managers_field_name') }}</label>
              <input v-model="editForm.name" class="form-control" :class="{'is-invalid': editFe.has('name')}" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('managers_field_role') }}</label>
              <select v-model="editForm.role" class="form-control">
                <option value="manager">{{ t('managers_role_manager') }}</option>
                <option value="admin">{{ t('managers_role_admin') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('managers_field_new_password') }}</label>
              <input v-model="editForm.new_password" type="password" class="form-control" />
              <p class="form-hint">{{ t('managers_field_new_password_hint') }}</p>
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
import type { Manager } from '../types'

const { t } = useI18n()

const managers = ref<Manager[]>([])
const loading = ref(true)
const saving = ref(false)

const showCreateModal = ref(false)
const createError = ref('')
const createFe = ref(new Set<string>())
const createErrorRef = ref<HTMLElement | null>(null)
const createForm = ref({ name: '', email: '', role: 'manager', password: '' })

const showEditModal = ref(false)
const editError = ref('')
const editFe = ref(new Set<string>())
const editErrorRef = ref<HTMLElement | null>(null)
const editForm = ref({ id: '', name: '', role: 'manager', new_password: '' })

function showCreateError(msg: string, fields: string[] = []) {
  createError.value = msg
  createFe.value = new Set(fields)
  nextTick(() => createErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

function showEditError(msg: string, fields: string[] = []) {
  editError.value = msg
  editFe.value = new Set(fields)
  nextTick(() => editErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

onMounted(async () => {
  try {
    const res = await api.get('/admin/managers')
    managers.value = res.data || []
  } catch {}
  loading.value = false
})

const openCreate = () => {
  createForm.value = { name: '', email: '', role: 'manager', password: '' }
  createError.value = ''
  createFe.value = new Set()
  showCreateModal.value = true
}

const createManager = async () => {
  const errs = new Set<string>()
  if (!createForm.value.name) errs.add('name')
  if (!createForm.value.email) errs.add('email')
  if (!createForm.value.password) errs.add('password')
  if (errs.size > 0) { showCreateError(t('error_required'), [...errs]); return }
  if (createForm.value.password.length < 8) { showCreateError(t('settings_pass_short'), ['password']); return }
  saving.value = true
  createError.value = ''
  createFe.value = new Set()
  try {
    const res = await api.post('/admin/managers', createForm.value)
    managers.value.unshift(res.data)
    showCreateModal.value = false
  } catch {
    showCreateError(t('error_create'))
  }
  saving.value = false
}

const openEdit = (m: Manager) => {
  editForm.value = { id: m.id, name: m.name, role: m.role, new_password: '' }
  editError.value = ''
  editFe.value = new Set()
  showEditModal.value = true
}

const saveEdit = async () => {
  if (!editForm.value.name) { showEditError(t('error_required'), ['name']); return }
  if (editForm.value.new_password && editForm.value.new_password.length < 8) {
    showEditError(t('settings_pass_short'))
    return
  }
  saving.value = true
  editError.value = ''
  editFe.value = new Set()
  try {
    const payload: Record<string, string> = { name: editForm.value.name, role: editForm.value.role }
    if (editForm.value.new_password) payload.new_password = editForm.value.new_password
    await api.put(`/admin/managers/${editForm.value.id}`, payload)
    const idx = managers.value.findIndex(m => m.id === editForm.value.id)
    if (idx !== -1) {
      managers.value[idx] = { ...managers.value[idx], name: editForm.value.name, role: editForm.value.role as Manager['role'] }
    }
    showEditModal.value = false
  } catch {
    showEditError(t('error_save'))
  }
  saving.value = false
}

const deleteManager = async (m: Manager) => {
  if (!confirm(`${t('managers_delete_confirm')} «${m.name}»?`)) return
  try {
    await api.delete(`/admin/managers/${m.id}`)
    managers.value = managers.value.filter(x => x.id !== m.id)
  } catch {}
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')
const roleBadge = (role: string) => ({ admin: 'badge-primary', super_admin: 'badge-primary', manager: 'badge-gray' }[role] || 'badge-gray')
</script>
