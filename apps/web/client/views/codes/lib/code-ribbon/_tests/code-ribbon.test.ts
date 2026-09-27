import type { BonusCode } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { codeRibbon, expiringCount } from '../code-ribbon';

const now = new Date('2026-09-26T12:00:00Z');

const code = (patch: Partial<BonusCode>): BonusCode => ({
  code: 'CODE',
  title: null,
  rewards: [],
  source: 'tanki.su',
  sourceUrl: null,
  status: 'working',
  workingReports: 0,
  expiredReports: 0,
  discoveredAt: '2026-09-01T00:00:00Z',
  expiresAt: null,
  lastReportAt: null,
  ...patch
});

const limits = { expiringDays: 7, freshDays: 3 };

describe('codeRibbon', () => {
  it('flags codes that expire within the window', () => {
    expect(codeRibbon({ code: code({ expiresAt: '2026-09-28T00:00:00Z' }), now, ...limits })).toEqual({ kind: 'expiring', days: 2 });
  });

  it('marks freshly discovered codes as new', () => {
    expect(codeRibbon({ code: code({ discoveredAt: '2026-09-25T00:00:00Z' }), now, ...limits })).toEqual({ kind: 'new' });
  });

  it('prefers the expiry warning over the new mark', () => {
    const fresh = code({ discoveredAt: '2026-09-25T00:00:00Z', expiresAt: '2026-09-27T00:00:00Z' });

    expect(codeRibbon({ code: fresh, now, ...limits })?.kind).toBe('expiring');
  });

  it('shows nothing before the client clock is known or for expired codes', () => {
    expect(codeRibbon({ code: code({ discoveredAt: '2026-09-25T00:00:00Z' }), now: null, ...limits })).toBeNull();
    expect(codeRibbon({ code: code({ status: 'expired', expiresAt: '2026-09-27T00:00:00Z' }), now, ...limits })).toBeNull();
    expect(codeRibbon({ code: code({ expiresAt: '2026-12-01T00:00:00Z' }), now, ...limits })).toBeNull();
  });
});

describe('expiringCount', () => {
  it('counts live codes that expire this week', () => {
    const codes = [code({ expiresAt: '2026-09-28T00:00:00Z' }), code({ expiresAt: '2026-11-01T00:00:00Z' }), code({ expiresAt: null })];

    expect(expiringCount({ codes, now, expiringDays: 7 })).toBe(1);
    expect(expiringCount({ codes, now: null, expiringDays: 7 })).toBeNull();
  });
});
