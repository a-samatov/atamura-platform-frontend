import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuizForm } from '../../../composables/useQuizForm'
import { useHomeContent } from '../../../composables/useHomeContent'

// useHomeContent is a Nuxt auto-import (global) — stub it for Vitest
vi.stubGlobal('useHomeContent', useHomeContent)

const fetchSpy = vi.fn().mockResolvedValue({})
vi.stubGlobal('$fetch', fetchSpy)

beforeEach(() => {
  fetchSpy.mockClear()
  fetchSpy.mockResolvedValue({})
})

describe('useQuizForm — initial state', () => {
  it('starts at step 0 with empty answers', () => {
    const form = useQuizForm('ru')
    expect(form.currentStep.value).toBe(0)
    expect(Object.keys(form.answers.value)).toHaveLength(0)
    expect(form.showContactForm.value).toBe(false)
    expect(form.success.value).toBe(false)
    expect(form.error.value).toBeNull()
    expect(form.loading.value).toBe(false)
  })

  it('progress is 0% before any selection', () => {
    const form = useQuizForm('ru')
    expect(form.progress.value).toBe(0)
  })

  it('exposes the correct number of questions', () => {
    const form = useQuizForm('ru')
    expect(form.questionsTotal.value).toBeGreaterThan(0)
    expect(form.questions.value).toHaveLength(form.questionsTotal.value)
  })

  it('currentQuestion points to the first question on start', () => {
    const form = useQuizForm('ru')
    expect(form.currentQuestion.value).toBe(form.questions.value[0])
  })
})

describe('useQuizForm — selectOption()', () => {
  it('stores the selected answer', () => {
    const form = useQuizForm('ru')
    form.selectOption(0, 'Студия')
    expect(form.answers.value[0]).toBe('Студия')
  })

  it('advances to the next step when not at the last question', () => {
    const form = useQuizForm('ru')
    if (form.questionsTotal.value < 2) return
    form.selectOption(0, 'opt')
    expect(form.currentStep.value).toBe(1)
    expect(form.showContactForm.value).toBe(false)
  })

  it('shows contact form after the last question is answered', () => {
    const form = useQuizForm('ru')
    const total = form.questionsTotal.value
    for (let i = 0; i < total; i++) form.selectOption(i, 'opt')
    expect(form.showContactForm.value).toBe(true)
  })

  it('progress increases after advancing a step', () => {
    const form = useQuizForm('ru')
    if (form.questionsTotal.value < 2) return
    form.selectOption(0, 'opt')
    expect(form.progress.value).toBeGreaterThan(0)
  })
})

describe('useQuizForm — submitContact()', () => {
  it('calls $fetch with POST to /quiz', async () => {
    const form = useQuizForm('ru')
    form.selectOption(0, 'Студия')
    await form.submitContact('Иван', '+7 700 123 45 67')

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, options] = fetchSpy.mock.calls[0] as [string, { method: string; body: unknown }]
    expect(url).toContain('/quiz')
    expect(options.method).toBe('POST')
  })

  it('includes name, phone, and type in the request body', async () => {
    const form = useQuizForm('ru')
    await form.submitContact('Иван', '+7 700 123 45 67')

    const [, options] = fetchSpy.mock.calls[0] as [string, { body: Record<string, unknown> }]
    expect(options.body).toMatchObject({ type: 'quiz', name: 'Иван', phone: '+7 700 123 45 67' })
  })

  it('includes collected answers mapped by question text', async () => {
    const form = useQuizForm('ru')
    const firstQuestion = form.questions.value[0].question
    form.selectOption(0, 'Студия')
    await form.submitContact('Иван', '+7 700')

    const [, options] = fetchSpy.mock.calls[0] as [string, { body: { quiz_answers: Record<string, string> } }]
    expect(options.body.quiz_answers[firstQuestion]).toBe('Студия')
  })

  it('sets success=true after a successful submission', async () => {
    const form = useQuizForm('ru')
    await form.submitContact('Иван', '+7 700')
    expect(form.success.value).toBe(true)
    expect(form.error.value).toBeNull()
    expect(form.loading.value).toBe(false)
  })

  it('sets error message on failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('network'))
    const form = useQuizForm('ru')
    await form.submitContact('Иван', '+7 700')
    expect(form.error.value).not.toBeNull()
    expect(form.success.value).toBe(false)
    expect(form.loading.value).toBe(false)
  })

  it('error message is locale-aware for "en"', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('fail'))
    const form = useQuizForm('en')
    await form.submitContact('Ivan', '+7 700')
    expect(form.error.value).toMatch(/call us/i)
  })

  it('error message is locale-aware for "kk"', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('fail'))
    const form = useQuizForm('kk')
    await form.submitContact('Иван', '+7 700')
    expect(form.error.value).toMatch(/қоңырау/i)
  })
})

describe('useQuizForm — reset()', () => {
  it('clears all state back to initial values', async () => {
    fetchSpy.mockResolvedValueOnce({})
    const form = useQuizForm('ru')
    form.selectOption(0, 'Студия')
    await form.submitContact('Иван', '+7 700')

    form.reset()

    expect(form.currentStep.value).toBe(0)
    expect(Object.keys(form.answers.value)).toHaveLength(0)
    expect(form.showContactForm.value).toBe(false)
    expect(form.success.value).toBe(false)
    expect(form.error.value).toBeNull()
    expect(form.loading.value).toBe(false)
  })
})
