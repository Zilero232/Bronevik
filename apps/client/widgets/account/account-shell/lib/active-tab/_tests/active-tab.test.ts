import { describe, expect, it } from 'vitest';

import { ACCOUNT_NAV, ROUTES } from '@/shared/constants';

import { isActiveTab } from '../active-tab';

describe('isActiveTab', () => {
  it('matches the overview tab only on its exact path', () => {
    expect(isActiveTab({ href: ROUTES.account.overview, pathname: ROUTES.account.overview })).toBe(true);
    expect(isActiveTab({ href: ROUTES.account.overview, pathname: ROUTES.account.billing })).toBe(false);
  });

  it('matches section tabs on nested paths', () => {
    expect(isActiveTab({ href: ROUTES.account.billing, pathname: `${ROUTES.account.billing}/history` })).toBe(true);
  });
});

describe('ACCOUNT_NAV', () => {
  const hrefs = ACCOUNT_NAV.flatMap((group) => group.items.map((item) => item.href));

  it('groups the account pages into three sections without repeats', () => {
    expect(ACCOUNT_NAV).toHaveLength(3);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('marks the battles list active on a battle review', () => {
    const active = hrefs.filter((href) => isActiveTab({ href, pathname: ROUTES.account.battle('abc') }));

    expect(active).toEqual([ROUTES.account.battles]);
  });
});
