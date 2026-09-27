import { describe, expect, it } from 'vitest';

import { referralToRegister } from '../referral-guard';

const REFERRER = '0b8e7a4c-2f4d-4a51-9a7e-3c1d2b6f8e90';

const USER = '5a1f3c2e-9b7d-4e6a-8c0b-1d2e3f4a5b6c';

describe('referralToRegister', () => {
  it('registers a valid referrer for a signed-in user', () => {
    expect(referralToRegister({ referrerId: REFERRER, userId: USER, registeredId: null })).toBe(REFERRER);
  });

  it('skips when the link carries no referrer', () => {
    expect(referralToRegister({ referrerId: null, userId: USER, registeredId: null })).toBeNull();
    expect(referralToRegister({ referrerId: '', userId: USER, registeredId: null })).toBeNull();
  });

  it('waits for the user to sign in', () => {
    expect(referralToRegister({ referrerId: REFERRER, userId: null, registeredId: null })).toBeNull();
  });

  it('never lets a user refer themselves', () => {
    expect(referralToRegister({ referrerId: USER, userId: USER, registeredId: null })).toBeNull();
  });

  it('does not register the same referrer twice', () => {
    expect(referralToRegister({ referrerId: REFERRER, userId: USER, registeredId: REFERRER })).toBeNull();
  });

  it('ignores a referrer id that is not a user id', () => {
    expect(referralToRegister({ referrerId: 'not-a-user', userId: USER, registeredId: null })).toBeNull();
  });
});
