import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { isActiveTab } from '../active-tab';

describe('isActiveTab', () => {
  it('matches the overview tab only on its exact path', () => {
    expect(isActiveTab({ href: ROUTES.me, pathname: ROUTES.me })).toBe(true);
    expect(isActiveTab({ href: ROUTES.me, pathname: ROUTES.account.billing })).toBe(false);
  });

  it('matches section tabs on nested paths', () => {
    expect(isActiveTab({ href: ROUTES.account.billing, pathname: `${ROUTES.account.billing}/history` })).toBe(true);
  });
});
