import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { plusStateOf } from '../plus-state';

const now = new Date('2026-09-26T12:00:00Z');
const base = { now, trialAvailable: true, trialDays: 7 };

describe('plusStateOf', () => {
  it('is none without a subscription and offers the trial', () => {
    expect(plusStateOf({ ...base, subscription: null })).toMatchObject({ state: 'none', periodEnd: null, trialAvailable: true });
  });

  it('names a running trial and never offers a second one during it', () => {
    const state = plusStateOf({ ...base, subscription: { status: 'trialing', currentPeriodEnd: addDays(now, 3) } });

    expect(state).toMatchObject({ state: 'trial', trialAvailable: false });
  });

  it('reports the grace end of a failed renewal', () => {
    const currentPeriodEnd = addDays(now, -1);
    const state = plusStateOf({ ...base, subscription: { status: 'pastDue', currentPeriodEnd } });

    expect(state).toMatchObject({ state: 'grace', graceEndsAt: addDays(currentPeriodEnd, 3).toISOString() });
  });

  it('is expired once the period and the grace are over', () => {
    expect(plusStateOf({ ...base, subscription: { status: 'pastDue', currentPeriodEnd: addDays(now, -4) } }).state).toBe('expired');
    expect(plusStateOf({ ...base, subscription: { status: 'active', currentPeriodEnd: addDays(now, -1) } }).state).toBe('expired');
  });

  it('is active for a paid running period', () => {
    expect(plusStateOf({ ...base, subscription: { status: 'active', currentPeriodEnd: addDays(now, 30) } })).toMatchObject({
      state: 'active',
      graceEndsAt: null,
      trialAvailable: false
    });
  });
});
