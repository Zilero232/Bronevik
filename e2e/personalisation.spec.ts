import { expect, test } from '@playwright/test';

import { STORAGE_KEYS } from '../apps/web/client/shared/constants/storage-keys';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const seed = (values: Record<string, unknown>) => {
  Object.entries(values).forEach(([key, value]) => window.localStorage.setItem(key, JSON.stringify(value)));
};

test.describe('personalisation without the API', () => {
  test.use({ locale: 'en-US' });

  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/**`, (route) => route.abort());
  });

  test('the home page asks for a nickname and says when it could not check one', async ({ page }) => {
    await page.goto('/en');

    const dashboard = page.getByRole('region', { name: 'My dashboard' });

    await expect(dashboard.getByRole('heading', { name: 'Your nickname?' })).toBeVisible();
    await dashboard.getByPlaceholder('For example, BERKUT83').fill('BERKUT83');
    await dashboard.getByRole('button', { name: 'Show my numbers' }).click();
    await expect(dashboard.getByText('Could not check the nickname, try again')).toBeVisible({ timeout: 30_000 });
  });

  test('a stored nickname turns the home page into a dashboard with an honest error state', async ({ page }) => {
    await page.addInitScript(seed, { [STORAGE_KEYS.ownPlayer]: { player: { accountId: 1, nickname: 'Tester' } } });
    await page.goto('/en');

    const dashboard = page.getByRole('region', { name: 'My dashboard' });

    await expect(dashboard.getByRole('button', { name: 'Retry' })).toBeVisible({ timeout: 30_000 });
    await expect(dashboard.getByRole('button', { name: 'Forget nickname' })).toBeVisible();
  });

  test('the compare tray keeps its picks and opens the compare page with them', async ({ page }) => {
    await page.addInitScript(seed, {
      [STORAGE_KEYS.compareSelection]: {
        tank: [],
        player: [
          { accountId: 1, nickname: 'First' },
          { accountId: 2, nickname: 'Second' }
        ],
        active: 'player'
      }
    });

    await page.goto('/en/tanks');

    const tray = page.getByRole('complementary', { name: 'Compare' });

    await expect(tray.getByRole('link', { name: /^Compare/ })).toHaveAttribute('href', /\/en\/compare\/players\?ids=1(%2C|,)2/);
    await tray.getByRole('button', { name: 'Clear the comparison' }).click();
    await expect(tray).toBeHidden();
  });
});
