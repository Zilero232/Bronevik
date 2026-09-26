import type { Browser, BrowserContextOptions, TestInfo } from '@playwright/test';

import { test } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import type { ScreenRoute } from './support/screens/routes';

import { measureOverflow, recordIssues, settle } from './support/screens/audit';
import { loadParams, saveEntry } from './support/screens/report';
import { collectRoutes, fillRoute, routeSlug } from './support/screens/routes';
import { SCREENS_ENV, SCREENS_PATHS } from './support/screens/screens.constants';

/**
 * Screenshot tour — not part of `test:e2e`. Walks every page under `app/[locale]/(site|overlay|tma)`
 * against an already running dev stack, full-page screenshots it per viewport into `e2e/.screens/`,
 * and folds console errors, failed requests and horizontal overflow into `e2e/.screens/report.json`.
 * Run with `bun run e2e:screens`.
 */

const viewportOf = (testInfo: TestInfo): string => {
  const { viewport } = testInfo.project.metadata;

  return typeof viewport === 'string' ? viewport : testInfo.project.name;
};

const contextOptions = (testInfo: TestInfo, storageState?: string): BrowserContextOptions => {
  const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent, locale, reducedMotion } = testInfo.project.use;

  return { baseURL: SCREENS_ENV.baseUrl, viewport, deviceScaleFactor, isMobile, hasTouch, userAgent, locale, reducedMotion, storageState };
};

const tour = async (browser: Browser, route: ScreenRoute, signedIn: boolean, testInfo: TestInfo) => {
  if (signedIn && !existsSync(SCREENS_PATHS.auth)) {
    test.skip(true, 'no signed-in session — the Lesta mock login is unavailable');
  }

  const filled = fillRoute(route, loadParams());

  if ('missing' in filled) {
    test.skip(true, `no value discovered for ${filled.missing}`);

    return;
  }

  const viewport = viewportOf(testInfo);
  const slug = routeSlug(route.locale, filled.path, signedIn);
  const screenshot = path.join(SCREENS_PATHS.out, viewport, `${slug}.png`);
  const context = await browser.newContext(contextOptions(testInfo, signedIn ? SCREENS_PATHS.auth : undefined));
  const page = await context.newPage();
  const issues = recordIssues(page);

  try {
    const response = await page.goto(filled.path, { waitUntil: 'load' });
    const { networkIdle } = await settle(page);
    const overflow = await measureOverflow(page, viewport === 'mobile');

    mkdirSync(path.dirname(screenshot), { recursive: true });
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled', caret: 'hide' });

    saveEntry(slug, {
      ...issues,
      viewport,
      pattern: route.pattern,
      path: filled.path,
      locale: route.locale,
      signedIn,
      status: response?.status() ?? null,
      finalUrl: page.url(),
      networkIdle,
      screenshot: path.relative(SCREENS_PATHS.out, screenshot).replaceAll('\\', '/'),
      overflow
    });
  } finally {
    await context.close();
  }
};

const routes = collectRoutes();

test.describe('screens — anonymous', () => {
  for (const route of routes) {
    test(`${route.locale} ${route.pattern}`, async ({ browser }, testInfo) => {
      await tour(browser, route, false, testInfo);
    });
  }
});

test.describe('screens — signed in', () => {
  for (const route of routes.filter((candidate) => candidate.needsAuth)) {
    test(`${route.locale} ${route.pattern}`, async ({ browser }, testInfo) => {
      await tour(browser, route, true, testInfo);
    });
  }
});
