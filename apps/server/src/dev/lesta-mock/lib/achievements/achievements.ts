import type { MockPlayerState, MockTotals, MockVehicleType } from '../../lesta-mock.types';
import type { AccountAchievementsInput, AchievementCounts, StageMetric, TankAchievementsInput } from './achievements.types';

import { MOCK_ACHIEVEMENTS, MOCK_SALT, MOCK_SERIES } from '../../config';
import { unitFloat } from '../random';
import { masteryLevel, masteryThresholds, tankMarks } from '../simulation';
import { damageRatio } from '../skill';
import { sumTotals } from '../stats';

const jitter = (seed: number, index: number, key: number): number => 0.8 + 0.4 * unitFloat(seed, MOCK_SALT.achievements, index, key);

const battlesOfType = (state: MockPlayerState, type: MockVehicleType | undefined): number =>
  [...state.tanks.values()].reduce((sum, tank) => sum + (type === undefined || tank.vehicle.type === type ? tank.random.battles : 0), 0);

const stageMetrics = (state: MockPlayerState, totals: MockTotals, heroes: number): Record<StageMetric, number> => ({
  heroes,
  frags: totals.frags,
  damage: totals.damageDealt + totals.damageReceived,
  spotted: totals.spotted,
  survivedWins: totals.survivedWins,
  capture: totals.capturePoints,
  defense: totals.droppedCapturePoints,
  highTierFrags: [...state.tanks.values()].reduce((sum, tank) => sum + (tank.vehicle.tier >= 8 ? tank.random.frags : 0), 0)
});

const seriesValue = (series: keyof typeof MOCK_SERIES, perf: number, battles: number, spread: number): number => {
  const config = MOCK_SERIES[series];

  return Math.max(0, Math.round((config.base + config.perf * (perf - 0.8) + config.log * Math.log(1 + battles / 100)) * spread));
};

export const accountAchievements = ({ world, player, state }: AccountAchievementsInput): AchievementCounts => {
  const perf = damageRatio(player);
  const totals = sumTotals([...state.tanks.values()].map((tank) => tank.random));
  const achievements: Record<string, number> = {};
  const maxSeries: Record<string, number> = {};
  const levels = [...state.tanks.values()].map((tank) =>
    masteryLevel(masteryThresholds(world.seed, tank.vehicle), Math.max(tank.random.maxXp, tank.other.maxXp))
  );

  let heroes = 0;

  for (const [key, achievement] of MOCK_ACHIEVEMENTS.entries()) {
    const { rule } = achievement;
    const spread = jitter(world.seed, player.index, key);

    if (rule.kind === 'rate') {
      const count = Math.floor(battlesOfType(state, 'type' in rule ? rule.type : undefined) * rule.base * perf ** rule.power * spread);

      achievements[achievement.name] = count;
      heroes += achievement.section === 'battle' ? count : 0;
    } else if (rule.kind === 'per') {
      achievements[achievement.name] = Math.floor((totals[rule.metric] / rule.every) * spread);
    } else if (rule.kind === 'mastery') {
      achievements[achievement.name] = levels.filter((level) => level === rule.level).length;
    } else if (rule.kind === 'series') {
      const value = seriesValue(rule.series, perf, totals.battles, spread);

      maxSeries[rule.series] = value;
      achievements[achievement.name] = value >= rule.threshold ? 1 : 0;
    } else if (rule.kind === 'veteran') {
      achievements[achievement.name] = totals.battles >= rule.battles && spread > 1 ? 1 : 0;
    }
  }

  const metrics = stageMetrics(state, totals, heroes);

  for (const achievement of MOCK_ACHIEVEMENTS) {
    const { rule } = achievement;

    if (rule.kind === 'stage') {
      const reached = rule.thresholds.filter((threshold) => metrics[rule.metric] >= threshold).length;

      achievements[achievement.name] = reached === 0 ? 0 : 5 - reached;
    }
  }

  return {
    achievements: Object.fromEntries(Object.entries(achievements).filter(([, value]) => value > 0)),
    max_series: maxSeries
  };
};

export const tankAchievements = ({ world, player, tank }: TankAchievementsInput) => {
  const perf = damageRatio(player);
  const battles = tank.random.battles;
  const marks = tankMarks(tank);
  const achievements: Record<string, number> = {};

  for (const [key, achievement] of MOCK_ACHIEVEMENTS.entries()) {
    const { rule } = achievement;

    if (rule.kind !== 'rate' || ('type' in rule && rule.type !== tank.vehicle.type)) {
      continue;
    }

    const count = Math.floor(battles * rule.base * perf ** rule.power * jitter(world.seed, player.index, key + tank.vehicle.tankId));

    if (count > 0) {
      achievements[achievement.name] = count;
    }
  }

  if (marks > 0) {
    achievements.marksOnGun = marks;
  }

  const spread = jitter(world.seed, player.index, tank.vehicle.tankId);

  return {
    tank_id: tank.vehicle.tankId,
    account_id: player.accountId,
    achievements,
    series: { sniper: 0, invincible: 0, diehard: Math.round(spread * 2), armorPiercer: 0, killing: 0, piercing: 1 },
    max_series: {
      sniper: seriesValue('sniper', perf, battles, spread),
      invincible: seriesValue('invincible', perf, battles, spread),
      diehard: seriesValue('diehard', perf, battles, spread),
      killing: seriesValue('killing', perf, battles, spread),
      piercing: seriesValue('piercing', perf, battles, spread)
    }
  };
};
