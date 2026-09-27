import { describe, expect, it } from 'vitest';

import { isTrialEligible, trialDaysFor } from '../trial';

describe('isTrialEligible', () => {
  it('needs a linked Lesta account', () => {
    expect(isTrialEligible({ linkedAccounts: 0, trialedRecords: 0, hasStartedTrial: false })).toBe(false);
  });

  it('refuses a user or an account that already had a trial', () => {
    expect(isTrialEligible({ linkedAccounts: 1, trialedRecords: 1, hasStartedTrial: false })).toBe(false);
    expect(isTrialEligible({ linkedAccounts: 1, trialedRecords: 0, hasStartedTrial: true })).toBe(false);
  });

  it('offers the trial to a first-time user with a linked account', () => {
    expect(isTrialEligible({ linkedAccounts: 2, trialedRecords: 0, hasStartedTrial: false })).toBe(true);
  });
});

describe('trialDaysFor', () => {
  it('doubles the trial for a referred user', () => {
    expect(trialDaysFor(false)).toBe(7);
    expect(trialDaysFor(true)).toBe(14);
  });
});
