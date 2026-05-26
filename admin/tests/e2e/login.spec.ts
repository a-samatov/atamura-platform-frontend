import { test, expect } from '@playwright/test'

// Auth guard and login flow for the admin panel.
// Requires the admin Vite preview server running on port 4173.

test.describe('Admin authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any lingering auth tokens between tests.
    // Must navigate first — localStorage is inaccessible on about:blank.
    await page.goto('/admin/')
    await page.evaluate(() => localStorage.clear())
    await page.context().clearCookies()
  })

  test('unauthenticated visit to /admin redirects to login', async ({ page }) => {
    await page.goto('/admin/applications')
    // Should end up on the login page
    await expect(page).toHaveURL(/\/login|\/admin\/login/)
    await expect(page.locator('form')).toBeVisible()
  })

  test('login page renders email and password fields', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"], button').filter({ hasText: /войти|sign in/i })).toBeVisible()
  })

  test('invalid credentials show an error message', async ({ page }) => {
    await page.goto('/admin/login')
    await page.locator('input[type="email"], input[name="email"]').fill('nobody@example.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.locator('button').filter({ hasText: /войти|sign in/i }).click()

    // The error message (from t('login_error')) should appear
    await expect(
      page.locator('[class*="error"], [class*="alert"]').filter({ hasText: /email|пароль|password/i })
    ).toBeVisible({ timeout: 5000 })
  })

  test('valid credentials redirect to the dashboard', async ({ page }) => {
    const email    = process.env.TEST_ADMIN_EMAIL    ?? 'admin@atamuragroup.kz'
    const password = process.env.TEST_ADMIN_PASSWORD ?? 'test_password'

    await page.goto('/admin/login')
    await page.locator('input[type="email"], input[name="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.locator('button').filter({ hasText: /войти|sign in/i }).click()

    // After login, we should be on an authenticated page
    await page.waitForURL(/applications|dashboard|news/, { timeout: 8000 })
    await expect(page.locator('aside.sidebar')).toBeVisible()
  })
})
