import type { PlayerTankRow, PlayerTanksPage } from '@bronevik/schemas';

import { moeMarks } from '@bronevik/ratings';

import { seededRandom } from '@/shared/lib';
import { MOCK_TANKS } from '@/shared/mocks';

import type { MatchesFilterInput, MockTanksInput, RowOfInput } from './mock.types';

import { mockPlayerById } from './mock-player';
import { clamp, isoDaysAgo, mockRating, mockStatsBlock, mockVehicle, round } from './mock.helpers';

const MARKABLE_TIER = 5;

const rowOf = ({ player, index }: RowOfInput): PlayerTankRow => {
  const tank = MOCK_TANKS[index];
  const random = seededRandom(player.id * 31 + tank.id);
  const skill = player.wn8 / 2000;
  const battles = round(40 + random() * random() * (player.battles / 22));
  const winRate = clamp(player.winRate + (tank.winRate - 50) + (random() - 0.5) * 9, 30, 80);
  const avgDamage = tank.avgDamage * Math.sqrt(skill) * (0.82 + random() * 0.32);
  const wn8 = player.wn8 * (avgDamage / (tank.avgDamage * Math.sqrt(skill))) * (0.9 + random() * 0.2);
  const moePercent = tank.tier >= MARKABLE_TIER ? round(clamp(28 + Math.min(skill, 1.8) * 16 + random() * 48, 5, 99.6), 2) : null;
  const recentBattles = random() > 0.45 ? round(random() * 42) : 0;

  return {
    vehicle: mockVehicle(tank),
    battles,
    winRate: round(winRate, 2),
    avgDamage: round(avgDamage),
    avgFrags: round(0.5 + skill * 0.4 + random() * 0.3, 2),
    avgXp: round(avgDamage * 0.3 + 180),
    survivalRate: round(clamp(22 + skill * 12 + random() * 10, 0, 100), 1),
    wn8: mockRating({ scale: 'wn8', value: wn8 }),
    markOfMastery: Math.min(4, Math.floor(random() * 5 * Math.min(1, skill))),
    marksOnGun: moePercent === null ? null : moeMarks(moePercent),
    moePercent,
    damagePercentile: round(clamp(skill * 55 + random() * 40, 1, 99.9), 1),
    maxFrags: round(3 + random() * 6),
    maxXp: round(avgDamage * 0.9 + random() * 1200),
    lastBattleAt: isoDaysAgo(round(random() * 90)),
    recent:
      recentBattles < 3
        ? null
        : {
            period: '30d',
            from: isoDaysAgo(30),
            to: new Date().toISOString(),
            stats: mockStatsBlock({
              battles: recentBattles,
              winRate: winRate + (random() - 0.5) * 12,
              avgDamage: avgDamage * (0.9 + random() * 0.25),
              wn8: wn8 * (0.9 + random() * 0.25),
              broneIndex: player.broneIndex,
              random
            })
          }
  };
};

const matchesFilter = ({ row, filter }: MatchesFilterInput) => {
  const { vehicle } = row;

  return (
    (!filter.tiers?.length || filter.tiers.includes(vehicle.tier)) &&
    (!filter.types?.length || filter.types.includes(vehicle.type)) &&
    (!filter.nations?.length || filter.nations.includes(vehicle.nation)) &&
    (filter.premium === undefined || filter.premium === vehicle.isPremium) &&
    row.battles >= (filter.minBattles ?? 0)
  );
};

export const mockTankRows = (accountId: number): PlayerTankRow[] => {
  const player = mockPlayerById(accountId);

  return MOCK_TANKS.map((_, index) => rowOf({ player, index }));
};

export const mockTanks = ({ accountId, filter = {} }: MockTanksInput): PlayerTanksPage => {
  const items = mockTankRows(accountId).filter((row) => matchesFilter({ row, filter }));

  return { items, total: items.length, limit: Math.max(items.length, 1), offset: 0 };
};
