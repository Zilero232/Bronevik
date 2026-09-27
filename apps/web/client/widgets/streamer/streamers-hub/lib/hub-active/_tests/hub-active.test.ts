import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { isHubActive } from '../hub-active';

describe('isHubActive', () => {
  it('matches the directory only on its own path', () => {
    expect(isHubActive({ href: ROUTES.streamers.list, pathname: ROUTES.streamers.list })).toBe(true);
    expect(isHubActive({ href: ROUTES.streamers.list, pathname: ROUTES.streamers.settings.table })).toBe(false);
  });

  it('keeps the settings tab active on the compare page', () => {
    expect(isHubActive({ href: ROUTES.streamers.settings.table, pathname: ROUTES.streamers.settings.compare })).toBe(true);
  });
});
