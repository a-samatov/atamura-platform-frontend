<template>
  <div class="login-page">

    <div class="login-card">
      <!-- Logo + brand -->
      <div class="login-brand">
        <div class="login-logo">
          <img src="/favicon.ico" alt="Logo" width="58" height="58" style="object-fit:contain" />
        </div>
        <div>
          <p class="login-company">Atamura Group</p>
          <p class="login-tagline">{{ t('login_subtitle') }}</p>
        </div>
      </div>

      <h2 class="login-title">{{ t('login_title') }}</h2>

      <form class="login-form" @submit.prevent="handleLogin" novalidate>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="form-group">
          <label class="form-label" for="email">{{ t('login_email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="admin@atamuragroup.kz"
            required
            autocomplete="email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">{{ t('login_password') }}</label>
          <div class="input-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              class="form-control"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              :disabled="loading"
            />
            <button type="button" class="input-eye" @click="showPwd = !showPwd" tabindex="-1">
              <svg v-if="!showPwd" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-full" style="height:48px;font-size:15px;margin-top:8px" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:18px;height:18px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:white" />
          <span v-else>{{ t('login_submit') }}</span>
        </button>
      </form>

      <p class="login-credit"><a class="a-link" href="https://studio.qbix.kz/" target="_blank" rel="noopener">{{ t('developed_by') }}</a></p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from '../i18n'

const { t } = useI18n()
const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const email   = ref('')
const password = ref('')
const loading  = ref(false)
const error    = ref('')
const showPwd  = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) return
  loading.value = true
  error.value   = ''
  const ok = await auth.login(email.value, password.value)
  if (ok) {
    const redirect = (route.query.redirect as string) || '/admin/applications'
    router.push(redirect)
  } else {
    error.value = t('login_error')
  }
  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0d1b2a 0%, #0e2636 55%, #0a3045 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.login-page::before {
  content: '';
  position: absolute;
  top: -160px;
  right: -160px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0,116,132,.14) 0%, transparent 70%);
  pointer-events: none;
}
.login-page::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(212,168,83,.07) 0%, transparent 70%);
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}
.login-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.login-company {
  font-size: 17px;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.login-tagline {
  font-size: 12px;
  color: var(--gray-500);
  margin-top: 2px;
  line-height: 1.4;
}

.login-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.04em;
  margin-bottom: 24px;
}

.login-form { display: flex; flex-direction: column; gap: 18px; }
.login-form .form-control { padding: 12px 16px; font-size: 15px; border-radius: var(--radius-lg); }
.login-form .form-label { font-size: 13.5px; }

.input-wrap { position: relative; }
.input-wrap .form-control { padding-right: 48px; }
.input-eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color var(--transition);
  display: flex;
  border-radius: var(--radius-sm);
}
.input-eye:hover { color: var(--gray-600); background: var(--gray-100); }

.login-credit {
  margin-top: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
}

.login-credit a {
  color: var(--gray-400);
}

.login-credit a:hover {
  color: var(--color-primary);
}

@media (max-width: 480px) {
  .login-card { padding: 28px 20px; border-radius: 16px; }
}
</style>
