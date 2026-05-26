import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// ── axios mock ────────────────────────────────────────────────────────────────
// Hoisted so it runs before module resolution
vi.mock('axios', () => {
  const mockAxios = {
    post:   vi.fn(),
    get:    vi.fn(),
    delete: vi.fn(),
    create: vi.fn(),
  }
  return { default: mockAxios }
})

import axios from 'axios'
import { useAuthStore } from '../../../src/stores/auth'

const mockedAxios = vi.mocked(axios)

const MANAGER = { id: 'mgr-1', name: 'Ivan', email: 'ivan@example.com', role: 'admin' as const }
const TOKENS   = { access_token: 'at-abc', refresh_token: 'rt-xyz' }

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  vi.clearAllMocks()
})

describe('useAuthStore — initial state', () => {
  it('is not authenticated when localStorage is empty', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.manager).toBeNull()
  })

  it('restores session from localStorage', () => {
    localStorage.setItem('access_token', 'tok-existing')
    localStorage.setItem('admin_manager', JSON.stringify(MANAGER))
    // Re-create pinia so the store reads fresh localStorage
    setActivePinia(createPinia())
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(true)
    expect(store.manager?.name).toBe('Ivan')
  })
})

describe('useAuthStore.login()', () => {
  it('returns true and persists tokens on success', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { ...TOKENS, manager: MANAGER },
    })
    const store = useAuthStore()
    const ok = await store.login('ivan@example.com', 'secret')

    expect(ok).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.manager?.email).toBe('ivan@example.com')
    expect(localStorage.getItem('access_token')).toBe('at-abc')
    expect(localStorage.getItem('refresh_token')).toBe('rt-xyz')
  })

  it('returns false and leaves state clean on bad credentials', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } })
    const store = useAuthStore()
    const ok = await store.login('bad@example.com', 'wrong')

    expect(ok).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.manager).toBeNull()
  })
})

describe('useAuthStore.logout()', () => {
  it('clears state and storage, calls the logout endpoint', async () => {
    localStorage.setItem('access_token', 'at-abc')
    localStorage.setItem('refresh_token', 'rt-xyz')
    localStorage.setItem('admin_manager', JSON.stringify(MANAGER))
    setActivePinia(createPinia())

    mockedAxios.delete.mockResolvedValueOnce({})
    const store = useAuthStore()
    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.manager).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(mockedAxios.delete).toHaveBeenCalledOnce()
  })

  it('clears local state even when the endpoint fails', async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error('network'))
    const store = useAuthStore()
    await store.logout()

    expect(store.isAuthenticated).toBe(false)
  })
})

describe('useAuthStore.refreshToken()', () => {
  it('updates access token in state and storage on success', async () => {
    localStorage.setItem('refresh_token', 'rt-old')
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'at-new', refresh_token: 'rt-new' },
    })

    const store = useAuthStore()
    const ok = await store.refreshToken()

    expect(ok).toBe(true)
    expect(localStorage.getItem('access_token')).toBe('at-new')
    expect(localStorage.getItem('refresh_token')).toBe('rt-new')
  })

  it('returns false when refresh endpoint rejects', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('expired'))
    const store = useAuthStore()
    const ok = await store.refreshToken()
    expect(ok).toBe(false)
  })
})
