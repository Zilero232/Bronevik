import type { TankServerStatsRow, TankStatsPage, TierList, TierListRank, VehicleCatalog } from '@bronevik/schemas';

import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';
import { MOCK_VEHICLES, mockVehicleSummary } from '@/shared/mocks';

import type { TankStatsInput, TierListInput } from './tanks.types';

import { TANK_MOCK } from './tanks.constants';

const round = (value: number) => Math.round(value * 100) / 100;

const hash = (value: string) => [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

export const mockStatsRows = ({ period = '7d', cohort = 'all', mode = 'random' }: TankStatsInput): TankServerStatsRow[] =>
  MOCK_VEHICLES.map((tank) => {
    const random = seededRandom(tank.id + hash(`${period}${cohort}${mode}`));
    const shift = TANK_MOCK.cohortShift[cohort];
    const winRate = round(tank.winRate + shift.winRate + (random() - 0.5) * 0.8);
    const playerWinRate = round(49.2 + shift.winRate + (random() - 0.5) * 1.6);
    const scale = TANK_MOCK.periodScale[period];

    return {
      vehicle: mockVehicleSummary(tank),
      period,
      cohort,
      mode,
      battles: Math.round(tank.battles * scale * (0.85 + random() * 0.3)),
      players: Math.round((tank.battles * scale) / (18 + random() * 12)),
      winRate,
      playerWinRate,
      winRateDiff: round(winRate - playerWinRate),
      avgDamage: Math.round(tank.avgDamage * shift.damage * (0.94 + random() * 0.12)),
      avgFrags: Math.round((0.6 + tank.tier * 0.05 + random() * 0.4) * 100) / 100,
      avgSpotted: Math.round((0.7 + (tank.type === 'lightTank' ? 1.2 : 0) + random() * 0.6) * 100) / 100,
      avgXp: Math.round(tank.avgDamage * 0.32 + random() * 120),
      avgBlocked: Math.round(tank.type === 'heavyTank' ? 900 + random() * 900 : 200 + random() * 400),
      survivalRate: round(26 + random() * 18),
      accuracy: round(72 + random() * 16),
      popularityRank: null,
      computedAt: TANK_MOCK.computedAt
    };
  });

const matchesFilter = (row: TankServerStatsRow, { tiers, types, nations, premium }: TankStatsInput) => {
  const { tier, type, nation, isPremium } = row.vehicle;

  return (
    (!tiers?.length || tiers.includes(tier)) &&
    (!types?.length || types.includes(type)) &&
    (!nations?.length || nations.includes(nation)) &&
    (premium === undefined || premium === isPremium)
  );
};

export const mockTankStats = (input: TankStatsInput): TankStatsPage => {
  const { sort = 'battles', order = 'desc', limit = TANK_MOCK.pageLimit, offset = 0 } = input;
  const byBattles = sortBy(mockStatsRows(input), [({ battles }) => battles, 'desc']).map((row, index) => ({ ...row, popularityRank: index + 1 }));
  const filtered = byBattles.filter((row) => matchesFilter(row, input));
  const sorted = sortBy(filtered, [(row) => (sort === 'tier' ? row.vehicle.tier : row[sort]), order]);

  return { items: sorted.slice(offset, offset + limit), total: sorted.length, limit, offset };
};

const rankOf = (position: number, count: number): TierListRank => {
  const share = position / Math.max(count, 1);

  return TANK_MOCK.tierBands.find((band) => share < band.until)?.rank ?? 'F';
};

export const mockTierList = ({ period = '7d', mode = 'random', tier, type }: TierListInput): TierList => {
  const rows = mockStatsRows({ period, mode }).filter(({ vehicle }) => (!tier || vehicle.tier === tier) && (!type || vehicle.type === type));
  const ranked = sortBy(rows, [({ winRateDiff }) => winRateDiff, 'desc']);
  const random = seededRandom(hash(`${period}${mode}`));

  return {
    mode,
    period,
    generatedAt: TANK_MOCK.computedAt,
    entries: ranked.map((row, index) => ({
      vehicle: row.vehicle,
      rank: rankOf(index, ranked.length),
      score: row.winRateDiff,
      winRateDiff: row.winRateDiff,
      battles: row.battles,
      trend: TANK_MOCK.trends[Math.floor(random() * TANK_MOCK.trends.length)] ?? null
    }))
  };
};

export const mockVehicleCatalog = (): VehicleCatalog => MOCK_VEHICLES.map(mockVehicleSummary);
