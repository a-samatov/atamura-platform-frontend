import { test, expect } from '@playwright/test'

// Prerequisite: the test user must be authenticated.
// In CI, set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD.

async function loginIfNeeded(page: import('@playwright/test').Page) {
  await page.goto('/admin/login')
  const isOnLogin = await page.locator('input[type="password"]').isVisible()
  if (!isOnLogin) return

  const email    = process.env.TEST_ADMIN_EMAIL    ?? 'admin@atamuragroup.kz'
  const password = process.env.TEST_ADMIN_PASSWORD ?? 'test_password'

  await page.locator('input[type="email"], input[name="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.locator('button').filter({ hasText: /войти|sign in/i }).click()
  await page.waitForURL(/applications|dashboard/, { timeout: 8000 })
}

test.describe('Applications list', () => {
  test.beforeEach(async ({ page }) => {
    await loginIfNeeded(page)
    await page.goto('/admin/applications')
  })

  test('renders the applications page with a table or empty state', async ({ page }) => {
    const table      = page.locator('.table, table')
    const emptyState = page.locator('.empty-state')

    // Either a data table or an empty-state element must be present
    await expect(table.or(emptyState)).toBeVisible({ timeout: 8000 })
  })

  test('status filter is present and has the expected options', async ({ page }) => {
    const statusFilter = page.locator('select').first()
    await expect(statusFilter).toBeVisible()

    const options = await statusFilter.locator('option').allTextContents()
    // Should include a "all statuses" option and at least one status
    expect(options.length).toBeGreaterThanOrEqual(2)
  })

  test('live indicator is visible (connection dot)', async ({ page }) => {
    await expect(page.locator('.live-dot')).toBeVisible()
  })
})
