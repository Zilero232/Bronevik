import type { PlusState } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { plusNotice } from '../plus-notice';

const now = new Date('2026-09-26T12:00:00Z');
const base: PlusState = { state: 'none', periodEnd: null, graceEndsAt: null, trialAvailable: false, trialDays: 7 };

describe('plusNotice', () => {
  it('counts down the days left in a trial', () => {
    expect(plusNotice({ plus: { ...base, state: 'trial', periodEnd: '2026-10-03T12:00:00.000Z' }, now })).toEqual({ kind: 'trial', daysLeft: 7 });
  });

  it('asks to update the card while a failed renewal is in its grace days', () => {
    expect(plusNotice({ plus: { ...base, state: 'grace', graceEndsAt: '2026-09-28T00:00:00.000Z' }, now })).toEqual({
      kind: 'grace',
      until: '2026-09-28T00:00:00.000Z'
    });
  });

  it('shows nothing for an ordinary active or free account', () => {
    expect(plusNotice({ plus: { ...base, state: 'active', periodEnd: '2026-10-26T00:00:00.000Z' }, now })).toBeNull();
    expect(plusNotice({ plus: base, now })).toBeNull();
  });
});
