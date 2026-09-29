import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

import { collectPatterns } from './support/screens/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const LESTA_COPYRIGHT = '© Lesta Games. All rights reserved.';

const SITE_GROUP = '(site)';

const BARE_GROUPS = ['(overlay)', '(tma)'] as const;

const ACCOUNT_PATTERN = /^\/me(?:\/|$)/;

const NUMERIC_PARAMS = new Set(['id', 'tankId', 'sessionId', 'campaign', 'operation']);

const MISSING_NUMBER = '999999999';

const MISSING_SLUG = 'e2e-missing';

const isDynamic = (pattern: string) => pattern.includes('[');

const fill = (pattern: string) =>
  pattern.replaceAll(/\[([^\]]+)\]/g, (_, name: string) => (NUMERIC_PARAMS.has(name) ? MISSING_NUMBER : MISSING_SLUG));

const localized = (pattern: string) => `/en${pattern === '/' ? '' : fill(pattern)}`;

const sitePatterns = collectPatterns([SITE_GROUP]);

const publicStatic = sitePatterns.filter((pattern) => !isDynamic(pattern) && !ACCOUNT_PATTERN.test(pattern));

const publicDynamic = sitePatterns.filter((pattern) => isDynamic(pattern) && !ACCOUNT_PATTERN.test(pattern));

const account = sitePatterns.filter((pattern) => ACCOUNT_PATTERN.test(pattern));

const bare = collectPatterns(BARE_GROUPS);

const trackPageErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

test.describe('every page without the API', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/**`, (route) => route.abort());
  });

  test('the route discovery finds the pages', () => {
    expect(publicStatic.length).toBeGreaterThan(0);
    expect(publicDynamic.length).toBeGreaterThan(0);
    expect(account.length).toBeGreaterThan(0);
  });

  for (const pattern of publicStatic) {
    test(`${pattern} renders its shell and the attribution`, async ({ page }) => {
      const errors = trackPageErrors(page);
      const response = await page.goto(localized(pattern));

      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toContainText(LESTA_COPYRIGHT);
      expect(errors).toEqual([]);
    });
  }

  for (const pattern of publicDynamic) {
    test(`${pattern} renders an error or not-found state for an unknown value`, async ({ page }) => {
      const errors = trackPageErrors(page);
      const response = await page.goto(localized(pattern));

      expect(response?.status()).toBeLessThan(500);
      await expect(page.getByRole('contentinfo')).toContainText(LESTA_COPYRIGHT);
      expect(errors).toEqual([]);
    });
  }

  for (const pattern of account) {
    test(`${pattern} asks a guest to sign in or offers a retry`, async ({ page }) => {
      const errors = trackPageErrors(page);
      const response = await page.goto(localized(pattern));

      expect(response?.status()).toBeLessThan(500);

      await expect(
        page
          .getByRole('link', { name: 'Sign in' })
          .or(page.getByRole('button', { name: 'Retry' }))
          .first()
      ).toBeVisible();

      expect(errors).toEqual([]);
    });
  }

  for (const pattern of bare) {
    test(`${pattern} renders without a server error`, async ({ page }) => {
      const errors = trackPageErrors(page);
      const response = await page.goto(localized(pattern));

      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).not.toBeEmpty();
      expect(errors).toEqual([]);
    });
  }
});
