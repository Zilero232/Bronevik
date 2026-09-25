import type { TierListEntry, TierListRank } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { groupByRank } from '../tier-groups';

const entry = (rank: TierListRank, tankId: number): TierListEntry => ({
  vehicle: {
    tankId,
    name: `T${tankId}`,
    shortName: `T${tankId}`,
    slug: `t${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  rank,
  score: 0,
  winRateDiff: 0,
  battles: 0,
  trend: null
});

describe('groupByRank', () => {
  it('orders bands from S down regardless of input order', () => {
    expect(groupByRank([entry('C', 1), entry('S', 2), entry('A', 3)]).map(({ rank }) => rank)).toEqual(['S', 'A', 'C']);
  });

  it('skips ranks that have no tanks', () => {
    expect(groupByRank([entry('B', 1)])).toHaveLength(1);
  });

  it('keeps every entry exactly once', () => {
    const input = [entry('S', 1), entry('S', 2), entry('D', 3)];

    expect(groupByRank(input).flatMap(({ entries }) => entries)).toHaveLength(input.length);
  });
});
