import { test, expect } from '@playwright/test'

// These tests verify that the three locale variants serve distinct content
// and that hreflang/canonical tags are correct for each route.

test.describe('Language switching', () => {
  test('Russian home (/) has lang="ru" and canonical pointing to /', async ({ page }) => {
    await page.goto('/')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('ru')

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toMatch(/\/$/)

    await expect(page).toHaveTitle(/Atamura Group/)
  })

  test('Kazakh home (/kz) has lang="kk" and canonical /kz', async ({ page }) => {
    await page.goto('/kz')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('kk')

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('/kz')
  })

  test('English home (/en) has lang="en" and canonical /en', async ({ page }) => {
    await page.goto('/en')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('/en')
  })

  test('Russian page content is in Russian', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').textContent()
    // The RU hero has a slide with distinct Russian text
    expect(body).toMatch(/Атмосфера|жилой|квартир/i)
  })

  test('English page renders English content', async ({ page }) => {
    await page.goto('/en')
    const body = await page.locator('body').textContent()
    // Should contain English words from the hero/benefits sections
    expect(body).toMatch(/Atmosfera|apartment|mortgage/i)
  })

  test('Kazakh page renders Kazakh content', async ({ page }) => {
    await page.goto('/kz')
    const body = await page.locator('body').textContent()
    expect(body).toMatch(/Атмосфера|пәтер|ипотека/i)
  })

  test('hreflang alternate tags present on all locale pages', async ({ page }) => {
    for (const url of ['/', '/en', '/kz']) {
      await page.goto(url)
      const hreflangs = await page.locator('link[hreflang]').all()
      // Expect at least ru, kk, en, x-default
      expect(hreflangs.length).toBeGreaterThanOrEqual(4)
    }
  })

  test('English partners section has locale-aware mortgage link', async ({ page }) => {
    await page.goto('/en')
    const mortgageLinks = page.locator('a[href*="/en/mortgage"]')
    await expect(mortgageLinks.first()).toBeVisible()
  })

  test('Kazakh partners section has locale-aware mortgage link', async ({ page }) => {
    await page.goto('/kz')
    const mortgageLinks = page.locator('a[href*="/kz/mortgage"]')
    await expect(mortgageLinks.first()).toBeVisible()
  })
})
