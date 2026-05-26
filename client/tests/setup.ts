import { vi } from 'vitest'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// Nuxt auto-imports these from Vue — expose them as globals so SFCs work in Vitest
Object.assign(globalThis, { ref, computed, onMounted, onUnmounted, nextTick, watch })

// Nuxt-specific globals
globalThis.$fetch = vi.fn().mockResolvedValue({})
globalThis.useRuntimeConfig = vi.fn(() => ({
  apiBase: 'http://localhost:3001/api',
  public: { apiBase: 'http://localhost:3001/api', siteUrl: 'http://localhost:3000' },
}))
globalThis.useRoute   = vi.fn(() => ({ path: '/', params: {}, query: {} }))
globalThis.useRouter  = vi.fn(() => ({ push: vi.fn(), replace: vi.fn() }))
globalThis.useHead    = vi.fn()
globalThis.useSeoMeta = vi.fn()
globalThis.useNuxtApp = vi.fn(() => ({ $pinia: {} }))
globalThis.navigateTo = vi.fn()

// Stub composables that delegate to Nuxt APIs
globalThis.useApiBase   = vi.fn(() => 'http://localhost:3001/api')
globalThis.useScrollReveal = vi.fn()
globalThis.useOptionalApi  = vi.fn().mockResolvedValue(null)
