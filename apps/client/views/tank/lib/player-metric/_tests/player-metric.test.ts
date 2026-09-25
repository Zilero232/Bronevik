import type { LeaderboardEntry } from '@bronevik/schemas';

import { RATING_SCALES } from '@bronevik/ratings';
import { describe, expect, it } from 'vitest';

import { RATING_TONES, ratingTone, toneOfTier } from '@/shared/lib';

import { playerMetric } from '../player-metric';

const entry = (value: number, tier: LeaderboardEntry['tier'] = null): LeaderboardEntry => ({
  rank: 1,
  accountId: 1,
  clanId: null,
  name: 'Player',
  clanTag: null,
  color: null,
  value,
  tier,
  battles: 100,
  delta: null
});

describe('playerMetric', () => {
  it('shows a win rate as the percent the API sends, without rescaling a small one', () => {
    expect(playerMetric({ metric: 'winRate', entry: entry(58) }).value).toBe(58);
    expect(playerMetric({ metric: 'winRate', entry: entry(0.5) }).value).toBe(0.5);
  });

  it('colours WN8 by the WN8 scale', () => {
    const value = RATING_SCALES.wn8.at(-1) ?? 0;

    expect(playerMetric({ metric: 'wn8', entry: entry(value) }).tone).toBe(ratingTone({ scale: 'wn8', value }));
  });

  it('colours damage by the rating tier the entry carries', () => {
    expect(playerMetric({ metric: 'avgDamage', entry: entry(3_000, 'unicum') }).tone).toBe(toneOfTier('unicum'));
  });

  it('falls back to a valid tone for damage without a rating tier', () => {
    expect(RATING_TONES).toContain(playerMetric({ metric: 'avgDamage', entry: entry(3_000) }).tone);
  });
});
