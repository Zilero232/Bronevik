import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { activeTabKey } from '../tab-match';

describe('activeTabKey', () => {
  it('matches the home tab only on the home page', () => {
    expect(activeTabKey(ROUTES.home)).toBe('home');
    expect(activeTabKey(ROUTES.tanks.list)).toBeNull();
  });

  it('matches a section and the pages under it', () => {
    expect(activeTabKey(ROUTES.marks)).toBe('marks');
    expect(activeTabKey(ROUTES.account.analytics)).toBe('me');
    expect(activeTabKey(ROUTES.hub)).toBe('more');
  });

  it('does not match a path that only shares a prefix', () => {
    expect(activeTabKey('/marksman')).toBeNull();
  });
});
