import { test as setup } from '@playwright/test';
import { rmSync } from 'node:fs';

import { discoverPublicParams, discoverSignedInParams } from './support/screens/discover';
import { saveParams } from './support/screens/report';
import { SCREENS_ENV, SCREENS_PATHS } from './support/screens/screens.constants';

/** The dev Lesta mock serves its account picker here when no Lesta key is configured. */
const MOCK_LOGIN_PATH = '/dev/lesta/wot/auth/login/';

setup('discover params and sign in through the Lesta mock', async ({ browser, request }) => {
  setup.setTimeout(120_000);
  rmSync(SCREENS_PATHS.out, { recursive: true, force: true });

  const publicParams = await discoverPublicParams(request);

  saveParams(publicParams);

  const context = await browser.newContext({ baseURL: SCREENS_ENV.baseUrl });
  const page = await context.newPage();
  const callbackURL = `${SCREENS_ENV.baseUrl}/me`;

  try {
    await page.goto(`${SCREENS_ENV.apiUrl}/auth/lesta/start?callbackURL=${encodeURIComponent(callbackURL)}`);

    if (!page.url().includes(MOCK_LOGIN_PATH)) {
      console.warn(`[screens] no Lesta mock picker (landed on ${page.url()}) — the signed-in pass is skipped`);

      return;
    }

    await page.locator('table tbody a').first().click();
    await page.waitForURL((url) => url.origin === new URL(SCREENS_ENV.baseUrl).origin, { timeout: 60_000 });

    const session = await page.request.get(`${SCREENS_ENV.apiUrl}/me`, { failOnStatusCode: false });

    if (!session.ok()) {
      console.warn(`[screens] mock sign-in did not produce a session (GET /me → ${session.status()}) — the signed-in pass is skipped`);

      return;
    }

    saveParams({ ...publicParams, ...(await discoverSignedInParams(page.request)) });
    await context.storageState({ path: SCREENS_PATHS.auth });
  } finally {
    await context.close();
  }
});
