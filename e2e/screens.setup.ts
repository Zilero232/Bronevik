import { test as setup } from '@playwright/test';
import { copyFileSync, existsSync, rmSync } from 'node:fs';

import { discoverPublicParams, discoverSignedInParams } from './support/screens/discover';
import { saveParams } from './support/screens/report';
import { SCREENS_ENV, SCREENS_PATHS } from './support/screens/screens.constants';

setup('discover params and load a saved signed-in session', async ({ browser, request }) => {
  setup.setTimeout(120_000);
  rmSync(SCREENS_PATHS.out, { recursive: true, force: true });

  const publicParams = await discoverPublicParams(request);

  saveParams(publicParams);

  if (!SCREENS_ENV.authState || !existsSync(SCREENS_ENV.authState)) {
    console.warn('[screens] no E2E_AUTH_STATE storage state — the signed-in pass is skipped');

    return;
  }

  const context = await browser.newContext({ baseURL: SCREENS_ENV.baseUrl, storageState: SCREENS_ENV.authState });

  try {
    const session = await context.request.get(`${SCREENS_ENV.apiUrl}/me`, { failOnStatusCode: false });

    if (!session.ok()) {
      console.warn(`[screens] the saved session is not signed in (GET /me → ${session.status()}) — the signed-in pass is skipped`);

      return;
    }

    saveParams({ ...publicParams, ...(await discoverSignedInParams(context.request)) });
    copyFileSync(SCREENS_ENV.authState, SCREENS_PATHS.auth);
  } finally {
    await context.close();
  }
});
