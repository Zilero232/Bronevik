import type { BonusCode } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { codeGroups } from '../code-groups';

const code = (value: string, status: BonusCode['status'], discoveredAt: string): BonusCode => ({
  code: value,
  title: null,
  rewards: [],
  source: 'tanki.su',
  sourceUrl: null,
  status,
  workingReports: 0,
  expiredReports: 0,
  discoveredAt,
  expiresAt: null,
  lastReportAt: null
});

describe('codeGroups', () => {
  it('splits expired codes from the ones still worth trying', () => {
    const groups = codeGroups([code('A', 'expired', '2026-09-01'), code('B', 'unknown', '2026-09-02'), code('C', 'working', '2026-09-03')]);

    expect(groups.active.map((item) => item.code)).toEqual(['C', 'B']);
    expect(groups.expired.map((item) => item.code)).toEqual(['A']);
  });

  it('puts confirmed codes first, then the newest unverified ones', () => {
    const groups = codeGroups([code('OLD', 'unknown', '2026-09-01'), code('NEW', 'unknown', '2026-09-20'), code('OK', 'working', '2026-08-01')]);

    expect(groups.active.map((item) => item.code)).toEqual(['OK', 'NEW', 'OLD']);
  });

  it('keeps both groups empty for an empty list', () => {
    expect(codeGroups([])).toEqual({ active: [], expired: [] });
  });
});
