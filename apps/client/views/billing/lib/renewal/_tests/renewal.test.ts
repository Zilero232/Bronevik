import { subscriptionStatusSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { RenewalInput } from '../renewal.types';

import { autoRenewState, periodEndKind, planCta } from '../renewal';

const ACTIVE: RenewalInput = {
  status: 'active',
  currentPeriodEnd: '2026-10-12T00:00:00.000Z',
  cancelAtPeriodEnd: false,
  isRecurringAvailable: true
};

describe('autoRenewState', () => {
  it('is on for an active subscription with a saved payment method', () => {
    expect(autoRenewState(ACTIVE)).toBe('on');
  });

  it('is off once the user cancels auto-renew', () => {
    expect(autoRenewState({ ...ACTIVE, cancelAtPeriodEnd: true })).toBe('off');
  });

  it('is unavailable without recurring payments, whatever the flag says', () => {
    expect(autoRenewState({ ...ACTIVE, isRecurringAvailable: false })).toBe('unavailable');
    expect(autoRenewState({ ...ACTIVE, isRecurringAvailable: false, cancelAtPeriodEnd: true })).toBe('unavailable');
  });

  it('is unavailable for a subscription that can no longer renew', () => {
    expect(autoRenewState({ ...ACTIVE, status: 'expired' })).toBe('unavailable');
    expect(autoRenewState({ ...ACTIVE, status: 'canceled' })).toBe('unavailable');
    expect(autoRenewState({ ...ACTIVE, status: null })).toBe('unavailable');
  });
});

describe('periodEndKind', () => {
  it('shows nothing without a period end', () => {
    expect(periodEndKind({ ...ACTIVE, currentPeriodEnd: null })).toBeNull();
    expect(periodEndKind({ ...ACTIVE, status: null })).toBeNull();
  });

  it('talks about the next renewal only while auto-renew is on', () => {
    subscriptionStatusSchema.options.forEach((status) => {
      const input = { ...ACTIVE, status };

      expect(periodEndKind(input) === 'renews').toBe(autoRenewState(input) === 'on');
    });
  });

  it('shows access-until after auto-renew is turned off', () => {
    expect(periodEndKind({ ...ACTIVE, cancelAtPeriodEnd: true })).toBe('accessUntil');
  });

  it('shows an end date for an expired subscription', () => {
    expect(periodEndKind({ ...ACTIVE, status: 'expired' })).toBe('ended');
  });
});

describe('planCta', () => {
  it('offers a plan change to a current Plus member', () => {
    expect(planCta({ isPlus: true, status: 'active' })).toBe('changePlan');
  });

  it('offers a renewal to a former member', () => {
    expect(planCta({ isPlus: false, status: 'expired' })).toBe('renew');
  });

  it('offers an upgrade to someone who never subscribed', () => {
    expect(planCta({ isPlus: false, status: null })).toBe('upgrade');
  });
});
