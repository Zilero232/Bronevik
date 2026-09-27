import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { inviteLink } from '../competition-view';

describe('inviteLink', () => {
  it('points at the competition page with the code', () => {
    const link = inviteLink({ slug: 'weekend-brawl', inviteCode: 'AB CD' });
    const url = new URL(link ?? '');

    expect(url.pathname).toBe(ROUTES.competitions.detail('weekend-brawl'));
    expect(url.searchParams.get('code')).toBe('AB CD');
  });

  it('is absent without a code', () => {
    expect(inviteLink({ slug: 'weekend-brawl', inviteCode: null })).toBeNull();
  });
});
