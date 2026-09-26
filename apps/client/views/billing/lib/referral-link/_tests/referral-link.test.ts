import { REFERRAL } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { referralLink } from '../referral-link';

const ORIGIN = 'https://otmetki.example';

describe('referralLink', () => {
  it('points at the Plus page on the same origin', () => {
    const url = new URL(referralLink({ origin: ORIGIN, userId: 'user-1' }));

    expect(url.origin).toBe(ORIGIN);
    expect(url.pathname).toBe(ROUTES.plus);
  });

  it('carries the user id in the referral parameter, escaped', () => {
    const userId = 'a b&c';
    const url = new URL(referralLink({ origin: ORIGIN, userId }));

    expect(url.searchParams.get(REFERRAL.param)).toBe(userId);
  });
});
