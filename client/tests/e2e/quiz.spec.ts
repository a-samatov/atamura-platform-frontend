import { test, expect } from '@playwright/test'

// E2E tests for the quiz section — full user journey from question selection
// to the thank-you screen. Runs against the real (or preview) Nuxt build.

// Advances through all quiz questions by clicking the first option each time.
// Uses data-quiz-step to detect when the Vue out-in transition is complete,
// preventing clicks during the DOM gap between leave and enter phases.
async function advanceThroughQuiz(quiz: import('@playwright/test').Locator) {
  const panel = quiz.locator('.quiz-panel')
  for (let i = 0; i < 10; i++) {
    if (await quiz.locator('#quiz-phone').isVisible()) break
    const stepBefore = await panel.getAttribute('data-quiz-step')
    await quiz.locator('.quiz-panel__opt').first().click()
    await expect(async () => {
      const newStep = await panel.getAttribute('data-quiz-step').catch(() => null)
      const phoneVisible = await quiz.locator('#quiz-phone').isVisible()
      if (phoneVisible) return
      if (!newStep || newStep === stepBefore) throw new Error('still on same step')
    }).toPass({ timeout: 5000 })
  }
}

test.describe('Quiz flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({ content: '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }' })
    await page.locator('.quiz-section').scrollIntoViewIfNeeded()
  })

  test('renders the first question', async ({ page }) => {
    const quiz = page.locator('.quiz-section')
    await expect(quiz.locator('.quiz-panel__q')).toBeVisible()
    const opts = quiz.locator('.quiz-panel__opt')
    await expect(opts.first()).toBeVisible()
    await expect(opts).toHaveCount(await opts.count())
  })

  test('progress bar starts near 0%', async ({ page }) => {
    const bar = page.locator('.quiz-progress-bar')
    const style = await bar.getAttribute('style')
    expect(style).toMatch(/width:\s*0%/)
  })

  test('selecting an answer advances to the next question', async ({ page }) => {
    const quiz = page.locator('.quiz-section')
    const panel = quiz.locator('.quiz-panel')
    const firstQ = await quiz.locator('.quiz-panel__q').textContent()
    const stepBefore = await panel.getAttribute('data-quiz-step')

    await quiz.locator('.quiz-panel__opt').first().click()

    // Wait for Vue out-in transition to complete: data-quiz-step must change
    await expect(panel).not.toHaveAttribute('data-quiz-step', stepBefore!, { timeout: 5000 })

    const nextText = await quiz.locator('.quiz-panel__q').textContent().catch(() => null)
    if (nextText !== null) expect(nextText).not.toBe(firstQ)
  })

  test('back button returns to previous question', async ({ page }) => {
    const quiz = page.locator('.quiz-section')
    const panel = quiz.locator('.quiz-panel')
    const firstQ = await quiz.locator('.quiz-panel__q').textContent()
    const step1 = await panel.getAttribute('data-quiz-step')

    await quiz.locator('.quiz-panel__opt').first().click()
    await expect(panel).not.toHaveAttribute('data-quiz-step', step1!, { timeout: 5000 })

    await quiz.locator('.quiz-back-btn').first().click()
    await expect(panel).toHaveAttribute('data-quiz-step', step1!, { timeout: 5000 })
    await expect(quiz.locator('.quiz-panel__q')).toHaveText(firstQ!)
  })

  test('full quiz flow reaches the contact form', async ({ page }) => {
    const quiz = page.locator('.quiz-section')
    await advanceThroughQuiz(quiz)
    await expect(quiz.locator('#quiz-phone')).toBeVisible()
  })

  test('contact form shows error when phone is blank', async ({ page }) => {
    const quiz = page.locator('.quiz-section')
    await advanceThroughQuiz(quiz)
    await quiz.locator('button').filter({ hasText: /Отправить|Send/i }).click()
    await expect(quiz.locator('.quiz-field-error')).toBeVisible()
  })

  test('submitting with a valid phone shows the thank-you screen', async ({ page }) => {
    const quiz = page.locator('.quiz-section')
    await advanceThroughQuiz(quiz)
    await quiz.locator('#quiz-phone').fill('+7 700 123 45 67')
    await quiz.locator('button').filter({ hasText: /Отправить|Send/i }).click()
    await expect(quiz.locator('.quiz-thanks')).toBeVisible({ timeout: 5000 })
    await expect(quiz.locator('.quiz-thanks__title')).toBeVisible()
  })
})
