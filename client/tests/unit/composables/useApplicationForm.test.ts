import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApplicationForm } from '../../../composables/useApplicationForm'
import type { ApplicationPayload } from '../../../types/api'

const fetchSpy = vi.fn().mockResolvedValue({})
vi.stubGlobal('$fetch', fetchSpy)

const PAYLOAD: ApplicationPayload = {
  type: 'application',
  jk_slug: 'atmosfera',
  name: 'Иван',
  phone: '+7 700 123 45 67',
  lang: 'ru',
  source: 'site',
}

beforeEach(() => {
  fetchSpy.mockClear()
  fetchSpy.mockResolvedValue({})
})

describe('useApplicationForm — initial state', () => {
  it('starts with all flags false and no error', () => {
    const form = useApplicationForm()
    expect(form.loading.value).toBe(false)
    expect(form.success.value).toBe(false)
    expect(form.error.value).toBeNull()
  })
})

describe('useApplicationForm — submit()', () => {
  it('calls $fetch with POST to /applications', async () => {
    const form = useApplicationForm()
    await form.submit(PAYLOAD)

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, options] = fetchSpy.mock.calls[0] as [string, { method: string }]
    expect(url).toContain('/applications')
    expect(options.method).toBe('POST')
  })

  it('passes the payload in the request body', async () => {
    const form = useApplicationForm()
    await form.submit(PAYLOAD)

    const [, options] = fetchSpy.mock.calls[0] as [string, { body: ApplicationPayload }]
    expect(options.body).toMatchObject(PAYLOAD)
  })

  it('sets success=true after a successful request', async () => {
    const form = useApplicationForm()
    await form.submit(PAYLOAD)
    expect(form.success.value).toBe(true)
    expect(form.error.value).toBeNull()
    expect(form.loading.value).toBe(false)
  })

  it('sets error message on failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('network'))
    const form = useApplicationForm()
    await form.submit(PAYLOAD)
    expect(form.error.value).not.toBeNull()
    expect(form.success.value).toBe(false)
    expect(form.loading.value).toBe(false)
  })

  it('error message is locale-aware for "ru"', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('fail'))
    const form = useApplicationForm('ru')
    await form.submit(PAYLOAD)
    expect(form.error.value).toMatch(/позвоните/i)
  })

  it('error message is locale-aware for "en"', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('fail'))
    const form = useApplicationForm('en')
    await form.submit(PAYLOAD)
    expect(form.error.value).toMatch(/call us/i)
  })

  it('error message is locale-aware for "kk"', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('fail'))
    const form = useApplicationForm('kk')
    await form.submit(PAYLOAD)
    expect(form.error.value).toMatch(/қоңырау/i)
  })
})

describe('useApplicationForm — reset()', () => {
  it('clears all state back to initial values', async () => {
    fetchSpy.mockResolvedValueOnce({})
    const form = useApplicationForm()
    await form.submit(PAYLOAD)

    form.reset()

    expect(form.loading.value).toBe(false)
    expect(form.success.value).toBe(false)
    expect(form.error.value).toBeNull()
  })

  it('clears error state as well', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('fail'))
    const form = useApplicationForm()
    await form.submit(PAYLOAD)
    expect(form.error.value).not.toBeNull()

    form.reset()
    expect(form.error.value).toBeNull()
  })
})
