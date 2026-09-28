import type { RecentPeriods, StatsBlock } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { hasRecentHistory } from '../has-recent-history';

const stats = (battles: number): StatsBlock => ({
  battles,
  winRate: null,
  avgDamage: null,
  avgFrags: null,
  avgSpotted: null,
  avgXp: null,
  avgBlocked: null,
  avgAssisted: null,
  survivalRate: null,
  accuracy: null,
  avgTier: null,
  wn8: { value: null, tier: null },
  eff: { value: null, tier: null },
  broneIndex: { value: null, tier: null }
});

const recent = (battles: (number | null)[]): RecentPeriods =>
  battles.map((count) => ({ period: '7d', from: null, to: null, stats: count === null ? null : stats(count) }));

describe('hasRecentHistory', () => {
  it('is false for a player we only just started tracking', () => {
    expect(hasRecentHistory(recent([null, null]))).toBe(false);
    expect(hasRecentHistory(recent([0, null]))).toBe(false);
  });

  it('is true once any period has battles', () => {
    expect(hasRecentHistory(recent([null, 12]))).toBe(true);
  });
});
