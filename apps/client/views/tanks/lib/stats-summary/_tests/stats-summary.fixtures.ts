import type { TankServerStatsRow } from '@bronevik/schemas';

export const statsRowsFixture = (seeds: Pick<TankServerStatsRow, 'battles' | 'winRateDiff'>[]): TankServerStatsRow[] =>
  seeds.map(({ battles, winRateDiff }, index) => ({
    vehicle: {
      tankId: index + 1,
      name: `T${index}`,
      shortName: `T${index}`,
      slug: `t${index}`,
      nation: 'ussr',
      type: 'heavyTank',
      tier: 10,
      isPremium: false,
      isCollectible: false,
      images: { small: null, contour: null, big: null }
    },
    period: '7d',
    cohort: 'all',
    mode: 'random',
    battles,
    players: 0,
    winRate: 50,
    playerWinRate: 50,
    winRateDiff,
    avgDamage: 0,
    avgFrags: 0,
    avgSpotted: 0,
    avgXp: 0,
    avgBlocked: 0,
    survivalRate: 0,
    accuracy: 0,
    popularityRank: null,
    computedAt: '2026-09-24T00:00:00+03:00'
  }));
