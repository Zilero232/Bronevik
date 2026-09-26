import type { PlayerInsights } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { hasInsights } from '../has-insights';

const EMPTY: PlayerInsights = { period: 'overall', battles: 0, tips: [], byClass: [], byTier: [], weakTanks: [], strongTanks: [] };

const GROUP = { key: '10', battles: 10, winRate: 50, serverWinRate: 49, winRateDelta: 1, damageRatio: null };

describe('hasInsights', () => {
  it('reports nothing to show when every list is empty', () => {
    expect(hasInsights(EMPTY)).toBe(false);
  });

  it('reports data as soon as one list has an entry', () => {
    expect(hasInsights({ ...EMPTY, byTier: [GROUP] })).toBe(true);
  });

  it('counts a lone tip as something to show', () => {
    expect(hasInsights({ ...EMPTY, tips: [{ code: 'no_weak_spots', params: {} }] })).toBe(true);
  });
});
