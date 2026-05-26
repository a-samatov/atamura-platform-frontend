import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir:       './tests/e2e',
  testMatch:     '**/*.spec.ts',
  timeout:       30_000,
  retries:       process.env.CI ? 2 : 0,
  workers:       process.env.CI ? 1 : undefined,
  reporter:      process.env.CI ? 'github' : 'list',
  fullyParallel: true,

  use: {
    baseURL:    'http://localhost:4173',
    trace:      'on-first-retry',
    screenshot: 'only-on-failure',
    video:      'off',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command:             'npm run preview',
    port:                4173,
    reuseExistingServer: !process.env.CI,
    timeout:             60_000,
  },
})
