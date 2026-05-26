import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Manager } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const stored = localStorage.getItem('admin_manager')
  const manager = ref<Manager | null>(stored ? JSON.parse(stored) : null)
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await axios.post('/api/admin/auth/login', { email, password })
      accessToken.value = res.data.access_token
      manager.value = res.data.manager
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('admin_manager', JSON.stringify(res.data.manager))
      if (res.data.refresh_token) {
        localStorage.setItem('refresh_token', res.data.refresh_token)
      }
      return true
    } catch {
      return false
    }
  }

  async function refreshToken(): Promise<boolean> {
    try {
      const storedRefresh = localStorage.getItem('refresh_token')
      const res = await axios.post(
        '/api/admin/auth/refresh',
        { refresh_token: storedRefresh },
        { withCredentials: true }
      )
      accessToken.value = res.data.access_token
      localStorage.setItem('access_token', res.data.access_token)
      if (res.data.refresh_token) {
        localStorage.setItem('refresh_token', res.data.refresh_token)
      }
      return true
    } catch {
      return false
    }
  }

  async function logout() {
    try { await axios.delete('/api/admin/auth/logout', { withCredentials: true }) } catch {}
    accessToken.value = null
    manager.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('admin_manager')
  }

  async function fetchMe(): Promise<void> {
    if (!accessToken.value) return
    try {
      const res = await axios.get('/api/admin/me', {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      })
      manager.value = res.data
      localStorage.setItem('admin_manager', JSON.stringify(res.data))
    } catch {}
  }

  return { manager, accessToken, isAuthenticated, login, refreshToken, logout, fetchMe }
})
