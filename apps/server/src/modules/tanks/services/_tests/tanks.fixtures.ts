import type { VehicleSummary } from '@otmetki/schemas';

import type { TankEconomyAggregate, TankLearningCurve, TankServerStats } from '../../../../../generated';
import type { CatalogEntry } from '../../../reference';

export const vehicle = (overrides: Partial<VehicleSummary> & Pick<VehicleSummary, 'tankId'>): VehicleSummary => ({
  name: `Tank ${overrides.tankId}`,
  shortName: `T${overrides.tankId}`,
  slug: `tank-${overrides.tankId}`,
  nation: 'ussr',
  type: 'mediumTank',
  tier: 8,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null },
  ...overrides
});

export const catalogEntry = (summary: VehicleSummary, specs: CatalogEntry['specs'] = null): CatalogEntry => ({
  summary,
  dbType: 'mediumTank',
  specs,
  description: null
});

export const catalogOf = (...entries: CatalogEntry[]): Map<number, CatalogEntry> => new Map(entries.map((entry) => [entry.summary.tankId, entry]));

export const serverStats = (overrides: Partial<TankServerStats> & Pick<TankServerStats, 'tankId'>): TankServerStats => ({
  mode: 'random',
  period: 'd7',
  cohort: 'all',
  battles: 1_000,
  players: 100,
  samples: 0,
  winRate: 50,
  playerWinRate: 50,
  winRateDiff: 0,
  avgDamage: 2_000,
  avgFrags: 1,
  avgSpotted: 1,
  avgXp: 800,
  avgBlocked: 300,
  survivalRate: 30,
  accuracy: 70,
  popularityRank: null,
  tierListRank: null,
  computedAt: new Date('2026-09-25T00:00:00Z'),
  ...overrides
});

export const learningRow = (overrides: Partial<TankLearningCurve> & Pick<TankLearningCurve, 'bucket' | 'tankId'>): TankLearningCurve => ({
  battles: 1_000,
  players: 100,
  wins: 500,
  damage: 2_000_000n,
  windowDays: 90,
  computedAt: new Date('2026-09-25T00:00:00Z'),
  ...overrides
});

export const economyRow = (overrides: Partial<TankEconomyAggregate> & Pick<TankEconomyAggregate, 'tankId'>): TankEconomyAggregate => ({
  account: 'premium',
  battles: 500,
  players: 50,
  costBattles: 500,
  credits: 60_000,
  creditsBase: 40_000,
  repair: 10_000,
  ammo: 8_000,
  consumables: 2_000,
  net: 40_000,
  xp: 1_200,
  freeXp: 60,
  windowDays: 30,
  computedAt: new Date('2026-09-25T00:00:00Z'),
  ...overrides
});
