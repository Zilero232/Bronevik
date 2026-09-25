import type { PlayerInsights, VehicleType } from '@bronevik/schemas';

import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';

import type { TankInsight } from '../players.types';
import type { MockInsightsInput } from './mock.types';

import { mockPlayerById } from './mock-player';
import { mockTankRows } from './mock-tanks';
import { round } from './mock.helpers';

const CLASSES: VehicleType[] = ['heavyTank', 'mediumTank', 'lightTank', 'AT-SPG', 'SPG'];

const TIERS = [6, 7, 8, 9, 10];

export const mockInsights = ({ accountId, period }: MockInsightsInput): PlayerInsights => {
  const player = mockPlayerById(accountId);
  const random = seededRandom(accountId + period.length * 13);
  const edge = (player.winRate - 50) * 0.35;

  const group = (key: string) => {
    const serverWinRate = round(49 + random() * 3, 2);
    const winRate = round(serverWinRate + edge + (random() - 0.6) * 14, 2);

    return {
      key,
      battles: round(200 + random() * 3_000),
      winRate,
      serverWinRate,
      winRateDelta: round(winRate - serverWinRate, 2),
      damageRatio: round(0.7 + random() * 0.9, 2)
    };
  };

  const tanks: TankInsight[] = mockTankRows(accountId).map((row) => {
    const serverWinRate = round(48 + random() * 4, 2);
    const winRate = round(serverWinRate + edge + (random() - 0.6) * 16, 2);
    const serverAvgDamage = round((row.avgDamage ?? 1_000) / (0.65 + edge / 50 + random() * 0.6));

    return {
      vehicle: row.vehicle,
      battles: row.battles,
      winRate,
      serverWinRate,
      winRateDelta: round(winRate - serverWinRate, 2),
      avgDamage: row.avgDamage ?? 0,
      serverAvgDamage,
      damageRatio: round((row.avgDamage ?? 0) / serverAvgDamage, 2)
    };
  });

  const ranked = sortBy(tanks, [({ winRateDelta }) => winRateDelta ?? 0, 'asc']);
  const byClass = CLASSES.map(group);
  const byTier = TIERS.map((tier) => group(String(tier)));
  const weakestClass = sortBy(byClass, ({ winRateDelta }) => winRateDelta ?? 0)[0];
  const weakestTier = sortBy(byTier, ({ winRateDelta }) => winRateDelta ?? 0)[0];
  const weakTanks = ranked.slice(0, 5);
  const lowDamage = sortBy(weakTanks, ({ damageRatio }) => damageRatio ?? 1)[0];

  return {
    period,
    battles: round(player.battles * (period === 'overall' ? 1 : 0.04)),
    byClass,
    byTier,
    weakTanks,
    strongTanks: ranked.slice(-5).reverse(),
    tips: [
      { code: 'weak_class', params: { type: weakestClass.key, winRateDelta: weakestClass.winRateDelta ?? 0 } },
      { code: 'weak_tier', params: { tier: Number(weakestTier.key), winRateDelta: weakestTier.winRateDelta ?? 0 } },
      { code: 'low_damage_tank', params: { tankId: lowDamage.vehicle.tankId, damageRatio: lowDamage.damageRatio ?? 0 } }
    ]
  };
};
