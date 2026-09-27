import type { PlayerProfile, StatsBlock } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { periodRatings } from '../period-ratings';

const RATING = { value: null, tier: null };

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
  wn8: RATING,
  eff: RATING,
  broneIndex: RATING
});

const PROFILE: PlayerProfile = {
  summary: {
    accountId: 1,
    nickname: 'Tester',
    clan: null,
    createdAt: null,
    lastBattleAt: null,
    updatedAt: '2026-09-25T00:00:00.000Z',
    isTracked: true,
    overall: stats(1000),
    marks: { moe3: 0, moe2: 0, moe1: 0, mastery: 0, tanksOwned: 0 }
  },
  recent: [
    { period: '30d', from: null, to: null, stats: stats(40) },
    { period: '7d', from: null, to: null, stats: stats(0) },
    { period: '24h', from: null, to: null, stats: null }
  ]
};

describe('periodRatings', () => {
  it('keeps the requested period order', () => {
    expect(periodRatings({ profile: PROFILE, periods: ['30d', 'overall'] }).map(({ period }) => period)).toEqual(['30d', 'overall']);
  });

  it('drops periods without battles or without stats', () => {
    expect(periodRatings({ profile: PROFILE, periods: ['7d', '24h', '60d'] })).toEqual([]);
  });

  it('reads the all-time row from the summary', () => {
    expect(periodRatings({ profile: PROFILE, periods: ['overall'] })[0].stats).toBe(PROFILE.summary.overall);
  });
});
