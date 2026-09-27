import type { TankServerStatsRow } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { tanksCsvRows } from '../tanks-csv';

describe('tanksCsvRows', () => {
  it('flattens the vehicle into plain columns', () => {
    const row: TankServerStatsRow = {
      vehicle: {
        tankId: 1,
        name: 'Объект 140',
        shortName: 'Об. 140',
        slug: 'object-140',
        nation: 'ussr',
        type: 'mediumTank',
        tier: 10,
        isPremium: false,
        isCollectible: false,
        images: { small: null, contour: null, big: null }
      },
      period: '7d',
      cohort: 'all',
      mode: 'random',
      playerWinRate: 51.3,
      popularityRank: 1,
      computedAt: '2026-09-27T00:00:00.000Z',
      battles: 10,
      players: 3,
      winRate: 52.5,
      winRateDiff: 1.2,
      avgDamage: 3000,
      avgFrags: 1,
      avgSpotted: 1.5,
      avgXp: 900,
      avgBlocked: 400,
      survivalRate: 40,
      accuracy: 80
    };

    expect(tanksCsvRows([row])[0]).toMatchObject({ tank: 'Объект 140', slug: 'object-140', tier: 10, winRate: 52.5, accuracy: 80 });
  });
});
