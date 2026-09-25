import type { ServerPeriod, SkillCohort, TierListRank } from '@bronevik/schemas';

export const TANK_MOCK = {
  computedAt: '2026-09-24T06:00:00+03:00',
  pageLimit: 100,
  periodScale: { '1d': 0.02, '7d': 0.12, '14d': 0.24, '30d': 0.5, '60d': 1 } satisfies Record<ServerPeriod, number>,
  cohortShift: {
    all: { winRate: 0, damage: 1 },
    beginner: { winRate: -3.2, damage: 0.72 },
    average: { winRate: -0.4, damage: 0.95 },
    good: { winRate: 2.4, damage: 1.18 },
    elite: { winRate: 6.1, damage: 1.42 }
  } satisfies Record<SkillCohort, { winRate: number; damage: number }>,
  tierBands: [
    { rank: 'S', until: 0.08 },
    { rank: 'A', until: 0.24 },
    { rank: 'B', until: 0.52 },
    { rank: 'C', until: 0.8 },
    { rank: 'D', until: 1.01 }
  ] satisfies { rank: TierListRank; until: number }[],
  trends: ['up', 'down', 'flat'] as const,
  trendDays: 60,
  patches: ['1.42', '1.43', '1.44', '1.45'],
  patchDates: ['2026-03-18T10:00:00+03:00', '2026-05-20T10:00:00+03:00', '2026-07-22T10:00:00+03:00', '2026-09-16T10:00:00+03:00'],
  patchKeys: ['reloadTime', 'dispersion', 'maxHealth', 'enginePower', 'aimingTime', 'shells.0.penetration100m', 'viewRange'],
  lowerIsBetter: ['reloadTime', 'dispersion', 'aimingTime'],
  stockFactor: { reloadTime: 1.12, aimingTime: 1.1, enginePower: 0.82, viewRange: 0.95, maxHealth: 0.93, damage: 0.85, penetration: 0.88 },
  topFactor: { reloadTime: 1, aimingTime: 1, enginePower: 1, viewRange: 1, maxHealth: 1, damage: 1, penetration: 1 },
  topWinRate: 68
} as const;

export const TANK_REQUEST = {
  trendDays: 60,
  topPlayersLimit: 10
} as const;
