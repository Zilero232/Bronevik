import { defineConfig, devices } from '@playwright/test';

/**
 * The screenshot tour (`bun run e2e:screens`) — separate from the smoke suite in
 * playwright.config.ts. It never starts a server: point it at a running stack with
 * E2E_BASE_URL (client, default http://localhost:3000) and E2E_API_URL (API, default http://localhost:4000).
 */

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

const SHARED = {
  baseURL: BASE_URL,
  locale: 'ru-RU',
  reducedMotion: 'reduce',
  trace: 'off',
  screenshot: 'off',
  video: 'off'
} as const;

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.screens/.results',

  fullyParallel: true,
  // A dev server compiles each route on first hit — a couple of workers keeps it responsive.
  workers: Number(process.env.E2E_SCREENS_WORKERS ?? 2),
  retries: 0,

  timeout: 120_000,

  reporter: [['list']],

  projects: [
    {
      name: 'screens-setup',
      testMatch: /screens\.setup\.ts/,
      teardown: 'screens-teardown'
    },
    {
      name: 'screens-teardown',
      testMatch: /screens\.teardown\.ts/
    },
    {
      name: 'screens-desktop',
      testMatch: /screens\.spec\.ts/,
      dependencies: ['screens-setup'],
      metadata: { viewport: 'desktop' },
      use: { ...devices['Desktop Chrome'], ...SHARED, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
    },
    {
      name: 'screens-mobile',
      testMatch: /screens\.spec\.ts/,
      dependencies: ['screens-setup'],
      metadata: { viewport: 'mobile' },
      use: { ...devices['Pixel 7'], ...SHARED, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }
    }
  ]
});
