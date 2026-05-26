import axios from 'axios'
import { useAuthStore } from './stores/auth'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Single in-flight refresh promise shared across all concurrent 401 responses
let refreshPromise: Promise<boolean> | null = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const authStore = useAuthStore()
      if (!refreshPromise) {
        refreshPromise = authStore.refreshToken().finally(() => {
          refreshPromise = null
        })
      }
      const refreshed = await refreshPromise
      if (refreshed) {
        original.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
        return api(original)
      }
      authStore.logout()
    }
    return Promise.reject(error)
  }
)
