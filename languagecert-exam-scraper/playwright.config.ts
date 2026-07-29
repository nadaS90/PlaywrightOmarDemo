import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 60_000,
  expect: { timeout: 50_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  outputDir: 'test-results',
  use: { headless: true, trace: 'retain-on-failure', navigationTimeout: 60_000 },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
