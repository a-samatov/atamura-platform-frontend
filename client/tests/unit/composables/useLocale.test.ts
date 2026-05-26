import { describe, it, expect, vi } from 'vitest'
import { useLocale } from '../../../composables/useLocale'

const mockRoute = globalThis.useRoute as ReturnType<typeof vi.fn>

describe('useLocale', () => {
  it('returns "kk" for paths starting with /kz', () => {
    mockRoute.mockReturnValue({ path: '/kz', params: {}, query: {} })
    expect(useLocale().value).toBe('kk')
  })

  it('returns "kk" for deep /kz/ sub-paths', () => {
    mockRoute.mockReturnValue({ path: '/kz/mortgage', params: {}, query: {} })
    expect(useLocale().value).toBe('kk')
  })

  it('returns "en" for paths starting with /en', () => {
    mockRoute.mockReturnValue({ path: '/en', params: {}, query: {} })
    expect(useLocale().value).toBe('en')
  })

  it('returns "en" for deep /en/ sub-paths', () => {
    mockRoute.mockReturnValue({ path: '/en/contacts', params: {}, query: {} })
    expect(useLocale().value).toBe('en')
  })

  it('returns "ru" for the root path', () => {
    mockRoute.mockReturnValue({ path: '/', params: {}, query: {} })
    expect(useLocale().value).toBe('ru')
  })

  it('returns "ru" for non-prefixed paths', () => {
    mockRoute.mockReturnValue({ path: '/news/some-article', params: {}, query: {} })
    expect(useLocale().value).toBe('ru')
  })

  it('returns "ru" for /jk/* paths', () => {
    mockRoute.mockReturnValue({ path: '/jk/atmosfera', params: {}, query: {} })
    expect(useLocale().value).toBe('ru')
  })
})
