import { defineConfig, devices } from '@playwright/test';
import { CheckboxAppFixtures } from './tests/fixtures';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<CheckboxAppFixtures>({
  testDir: './tests',
  retries: 0,
  /* Use 1 worker to be able to control concurrency */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Backend URL
    baseURL: 'http://localhost:3000',
    // Frontend URL
    frontendBaseURL: 'http://localhost:4200',
    trace: {
      mode: 'retain-on-failure',
      attachments: true,
      screenshots: true,
      snapshots: true,
      sources: true,
    },
    screenshot: 'only-on-failure',
    video: {
      // Wir nutzen Traces, aber keine Videos
      mode: 'off',
    },
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 5000,
  },
  timeout: 30000,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1460, height: 1200 } },
    },
  ],
});
