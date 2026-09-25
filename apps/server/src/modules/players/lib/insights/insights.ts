import { groupBy, sortBy, sumBy } from 'remeda';

import type {
  ComputeInsightsInput,
  GroupInsight,
  GroupsOfInput,
  Insights,
  InsightTank,
  InsightTip,
  TankInsight,
  TipsInput,
  WeightedMeanInput
} from './insights.types';

import { INSIGHTS } from './insights.constants';

const damageRatio = (tank: InsightTank): number | null =>
  tank.serverAvgDamage && tank.serverAvgDamage > 0 ? tank.avgDamage / tank.serverAvgDamage : null;

const winRateDelta = (tank: InsightTank): number | null => (tank.serverWinRate === null ? null : tank.winRate - tank.serverWinRate);

const score = (tank: TankInsight): number =>
  (tank.damageRatio === null ? 0 : tank.damageRatio - 1) + (tank.winRateDelta ?? 0) * INSIGHTS.winRateWeight;

const toTankInsight = (tank: InsightTank): TankInsight => ({
  tankId: tank.tankId,
  battles: tank.battles,
  winRate: tank.winRate,
  serverWinRate: tank.serverWinRate,
  winRateDelta: winRateDelta(tank),
  avgDamage: tank.avgDamage,
  serverAvgDamage: tank.serverAvgDamage,
  damageRatio: damageRatio(tank)
});

const weightedMean = ({ tanks, pick }: WeightedMeanInput): number | null => {
  const rated = tanks.flatMap((tank) => {
    const value = pick(tank);

    return value === null ? [] : [{ value, battles: tank.battles }];
  });

  const battles = sumBy(rated, (entry) => entry.battles);

  return battles === 0 ? null : sumBy(rated, (entry) => entry.value * entry.battles) / battles;
};

const toGroup = ([key, tanks]: [string, InsightTank[]]): GroupInsight => {
  const winRate = weightedMean({ tanks, pick: (tank) => tank.winRate });
  const serverWinRate = weightedMean({ tanks, pick: (tank) => tank.serverWinRate });

  return {
    key,
    battles: sumBy(tanks, (tank) => tank.battles),
    winRate,
    serverWinRate,
    winRateDelta: winRate === null || serverWinRate === null ? null : winRate - serverWinRate,
    damageRatio: weightedMean({ tanks, pick: damageRatio })
  };
};

const groupsOf = ({ tanks, keyOf }: GroupsOfInput): GroupInsight[] =>
  sortBy(Object.entries(groupBy(tanks, keyOf)).map(toGroup), (group) => group.winRateDelta ?? 0);

const tipsFor = ({ byClass, byTier, weakTanks, battles }: TipsInput): InsightTip[] => {
  const tips: InsightTip[] = [];

  if (battles < INSIGHTS.minTotalBattles) {
    tips.push({ code: 'not_enough_battles', params: { battles, required: INSIGHTS.minTotalBattles } });

    return tips;
  }

  const weakestClass = byClass.find((group) => (group.winRateDelta ?? 0) <= -INSIGHTS.weakWinRateDelta);
  const weakestTier = byTier.find((group) => (group.winRateDelta ?? 0) <= -INSIGHTS.weakWinRateDelta);
  const weakestTank = weakTanks.find((tank) => (tank.damageRatio ?? 1) < 1 - INSIGHTS.weakDamageShortfall);

  if (weakestClass) {
    tips.push({ code: 'weak_class', params: { type: weakestClass.key, winRateDelta: weakestClass.winRateDelta ?? 0 } });
  }

  if (weakestTier) {
    tips.push({ code: 'weak_tier', params: { tier: Number(weakestTier.key), winRateDelta: weakestTier.winRateDelta ?? 0 } });
  }

  if (weakestTank) {
    tips.push({ code: 'low_damage_tank', params: { tankId: weakestTank.tankId, damageRatio: weakestTank.damageRatio ?? 0 } });
  }

  if (tips.length === 0) {
    tips.push({ code: 'no_weak_spots', params: {} });
  }

  return tips;
};

export const computeInsights = ({ tanks, minBattles }: ComputeInsightsInput): Insights => {
  const eligible = tanks.filter((tank) => tank.battles >= minBattles);
  const battles = sumBy(eligible, (tank) => tank.battles);
  const byClass = groupsOf({ tanks: eligible, keyOf: (tank) => tank.type });
  const byTier = groupsOf({ tanks: eligible, keyOf: (tank) => String(tank.tier) });
  const ranked = sortBy(eligible.map(toTankInsight), score);
  const weakTanks = ranked.slice(0, INSIGHTS.tanksShown);
  const strongTanks = ranked.slice(-INSIGHTS.tanksShown).reverse();

  return { battles, byClass, byTier, weakTanks, strongTanks, tips: tipsFor({ byClass, byTier, weakTanks, battles }) };
};
