import { describe, expect, it } from 'vitest';

import { BONUS_CODE } from '../../../config';
import { bonusCodeStatus } from '../bonus-status';

const now = new Date('2026-09-25T00:00:00Z');
const enough = BONUS_CODE.minReports;

describe('bonusCodeStatus', () => {
  it('stays unknown until enough people reported', () => {
    expect(bonusCodeStatus({ working: enough - 1, expired: 0, expiresAt: null, now })).toBe('unknown');
  });

  it('follows a clear majority either way', () => {
    expect(bonusCodeStatus({ working: enough, expired: 0, expiresAt: null, now })).toBe('working');
    expect(bonusCodeStatus({ working: 0, expired: enough, expiresAt: null, now })).toBe('expired');
  });

  it('stays unknown when reports are split', () => {
    expect(bonusCodeStatus({ working: enough, expired: enough, expiresAt: null, now })).toBe('unknown');
  });

  it('expires on the published deadline regardless of reports', () => {
    expect(bonusCodeStatus({ working: 10, expired: 0, expiresAt: now, now })).toBe('expired');
    expect(bonusCodeStatus({ working: 10, expired: 0, expiresAt: new Date(now.getTime() + 1), now })).toBe('working');
  });
});
