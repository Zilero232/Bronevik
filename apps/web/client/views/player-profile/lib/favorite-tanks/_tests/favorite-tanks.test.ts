import type { PlayerTankRow } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { favoriteTanks } from '../favorite-tanks';

const row = ({ tankId, battles }: { tankId: number; battles: number }): PlayerTankRow => ({
  vehicle: {
    tankId,
    name: `Tank ${tankId}`,
    shortName: `T${tankId}`,
    slug: `tank-${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    status: 'researchable',
    images: { small: null, contour: null, big: null }
  },
  battles,
  winRate: null,
  avgDamage: null,
  avgFrags: null,
  avgXp: null,
  survivalRate: null,
  wn8: { value: null, tier: null },
  markOfMastery: 0,
  marksOnGun: null,
  moePercent: null,
  damagePercentile: null,
  maxFrags: null,
  maxXp: null,
  lastBattleAt: null,
  recent: null
});

const ROWS = [row({ tankId: 1, battles: 40 }), row({ tankId: 2, battles: 900 }), row({ tankId: 3, battles: 0 }), row({ tankId: 4, battles: 120 })];

describe('favoriteTanks', () => {
  it('orders the garage by battles played, most first', () => {
    const battles = favoriteTanks({ rows: ROWS, count: ROWS.length }).map(({ battles: count }) => count);

    expect(battles).toEqual([...battles].sort((a, b) => b - a));
  });

  it('never returns more tanks than asked for', () => {
    expect(favoriteTanks({ rows: ROWS, count: 2 })).toHaveLength(2);
  });

  it('leaves out tanks without a single battle', () => {
    expect(favoriteTanks({ rows: ROWS, count: ROWS.length }).every(({ battles }) => battles > 0)).toBe(true);
  });

  it('returns nothing for an empty garage', () => {
    expect(favoriteTanks({ rows: [], count: 6 })).toEqual([]);
  });
});
