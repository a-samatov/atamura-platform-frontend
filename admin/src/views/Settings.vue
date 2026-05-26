<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom:0">{{ t('settings_title') }}</h1>
    </div>

    <div class="settings-grid">

      <!-- Left column: profile + logout -->
      <div class="settings-col">

        <!-- Profile card -->
        <div class="card settings-profile">
          <div class="card-body">
            <div class="profile-avatar">{{ userInitials }}</div>
            <div class="profile-name">{{ auth.manager?.name || '—' }}</div>
            <div class="profile-email">{{ auth.manager?.email || '—' }}</div>
            <span class="badge" :class="auth.manager?.role === 'admin' ? 'badge-primary' : 'badge-gray'" style="margin-top:10px">
              {{ auth.manager?.role || 'manager' }}
            </span>
          </div>
        </div>

        <!-- Logout -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">{{ t('settings_logout') }}</span>
          </div>
          <div class="card-body">
            <p class="text-muted mb-4" style="font-size:14px">{{ t('logout_hint') }}</p>
            <button class="btn btn-danger w-full" @click="handleLogout">{{ t('logout') }}</button>
          </div>
        </div>

      </div>

      <!-- Right column: password + system -->
      <div class="settings-col">

        <!-- Password change -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">{{ t('settings_password') }}</span>
          </div>
          <div class="card-body">
            <div v-if="passwordSaved" class="alert alert-success mb-4">{{ t('saved_ok') }}</div>
            <div v-if="passwordError" class="alert alert-danger mb-4">{{ passwordError }}</div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('settings_cur_pass') }}</label>
              <input v-model="passwordForm.current" type="password" class="form-control" autocomplete="current-password" />
            </div>
            <div class="form-group mb-4">
              <label class="form-label">{{ t('settings_new_pass') }}</label>
              <input v-model="passwordForm.newPass" type="password" class="form-control" autocomplete="new-password" />
            </div>
            <div class="form-group mb-5">
              <label class="form-label">{{ t('settings_confirm_pass') }}</label>
              <input v-model="passwordForm.confirm" type="password" class="form-control" autocomplete="new-password" />
            </div>
            <button class="btn btn-primary" :disabled="savingPassword" @click="changePassword">
              <span v-if="savingPassword" class="spinner" style="width:15px;height:15px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:white" />
              <span v-else>{{ t('save') }}</span>
            </button>
          </div>
        </div>

        <!-- System info -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">{{ t('settings_system') }}</span>
          </div>
          <div class="card-body">
            <dl class="info-list">
              <dt>{{ t('settings_system') }}</dt>
              <dd>Atamura Admin Panel</dd>
              <dt>{{ t('version') }}</dt>
              <dd><span class="badge badge-gray">1.0.0</span></dd>
              <dt>{{ t('settings_email') }}</dt>
              <dd><a href="mailto:info@atamuragroup.kz" class="text-primary">info@atamuragroup.kz</a></dd>
              <dt>{{ t('developer') }}</dt>
              <dd class="text-muted">Amanix</dd>
            </dl>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from '../i18n'
import { api } from '../api'

const { t } = useI18n()
const auth   = useAuthStore()
const router = useRouter()

const userInitials = computed(() => {
  const name = auth.manager?.name || 'A'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const passwordForm   = ref({ current: '', newPass: '', confirm: '' })
const passwordSaved  = ref(false)
const passwordError  = ref('')
const savingPassword = ref(false)

const changePassword = async () => {
  passwordError.value = ''
  passwordSaved.value = false
  if (!passwordForm.value.current || !passwordForm.value.newPass) {
    passwordError.value = t('error_required'); return
  }
  if (passwordForm.value.newPass !== passwordForm.value.confirm) {
    passwordError.value = t('settings_pass_mismatch'); return
  }
  if (passwordForm.value.newPass.length < 8) {
    passwordError.value = t('settings_pass_short'); return
  }
  savingPassword.value = true
  try {
    await api.put('/admin/password', {
      current_password: passwordForm.value.current,
      new_password:     passwordForm.value.newPass,
    })
    passwordSaved.value = true
    passwordForm.value = { current: '', newPass: '', confirm: '' }
    setTimeout(() => { passwordSaved.value = false }, 3000)
  } catch {
    passwordError.value = t('settings_pass_mismatch')
  }
  savingPassword.value = false
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}
.settings-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-profile .card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px 24px;
}
.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: var(--primary);
  color: white;
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.profile-name  { font-size: 18px; font-weight: 700; color: var(--dark); letter-spacing: -0.02em; }
.profile-email { font-size: 13px; color: var(--gray-500); margin-top: 4px; }

.info-list { display: grid; grid-template-columns: 130px 1fr; gap: 12px 16px; font-size: 14px; align-items: center; }
.info-list dt { color: var(--gray-500); font-weight: 500; font-size: 13px; }
.info-list dd { color: var(--dark); font-weight: 500; }

.mb-4 { margin-bottom: 16px; }
.mb-5 { margin-bottom: 20px; }

@media (max-width: 900px) {
  .settings-grid { grid-template-columns: 1fr; }
}
</style>
