import type { LeaderboardEntry, TankDetail, TankPatches, TankPatchVerdict, TankTrend, TopPlayers, VehicleStats } from '@bronevik/schemas';

import { ratingTier } from '@bronevik/ratings';
import { addDays, formatISO, parseISO } from 'date-fns';

import { seededRandom } from '@/shared/lib';
import { findMockVehicle, MOCK_PLAYERS, mockVehicleSummary } from '@/shared/mocks';

import type {
  MockSpecInput,
  MockTopEntriesInput,
  MockTopValueInput,
  MockVehicleStatsInput,
  TankDetailInput,
  TankTopPlayersInput,
  TankTrendInput
} from './tanks.types';

import { mockMasteryThreshold, mockMoeThreshold } from '../marks/marks.mock';
import { TANK_MOCK } from './tanks.constants';
import { mockStatsRows } from './tanks.mock';

const TYPE_PROFILE = {
  lightTank: { hp: 0.72, speed: 70, view: 400, reload: 0.8, dispersion: 0.36, weight: 0.6 },
  mediumTank: { hp: 0.9, speed: 55, view: 390, reload: 0.9, dispersion: 0.3, weight: 0.8 },
  heavyTank: { hp: 1.2, speed: 38, view: 380, reload: 1.25, dispersion: 0.38, weight: 1.4 },
  'AT-SPG': { hp: 1, speed: 40, view: 370, reload: 1.35, dispersion: 0.27, weight: 1.2 },
  SPG: { hp: 0.6, speed: 40, view: 330, reload: 2.4, dispersion: 0.62, weight: 0.9 }
} as const;

const LOWER_IS_BETTER: ReadonlySet<string> = new Set(TANK_MOCK.lowerIsBetter);

const round = (value: number, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits;

export const mockVehicleStats = ({ tank, profile }: MockVehicleStatsInput): VehicleStats => {
  const random = seededRandom(tank.id * 3);
  const type = TYPE_PROFILE[tank.type];
  const factor = profile === 'stock' ? TANK_MOCK.stockFactor : TANK_MOCK.topFactor;
  const weight = round((12 + tank.tier * 5.4) * type.weight * (0.9 + random() * 0.2), 1);
  const enginePower = Math.round((weight * (13 + random() * 10) + tank.tier * 20) * factor.enginePower);
  const damage = Math.round((60 + tank.tier * 36) * type.reload * (0.9 + random() * 0.25) * factor.damage);
  const reloadTime = round((4 + tank.tier * 0.6) * type.reload * (0.9 + random() * 0.2) * factor.reloadTime);
  const rateOfFire = round(60 / reloadTime);
  const penetration = Math.round((90 + tank.tier * 26 + random() * 40) * factor.penetration);

  const shell = {
    shell: `${tank.slug}-ap`,
    kind: 'ARMOR_PIERCING',
    caliber: 60 + tank.tier * 10,
    isPremium: false,
    damage,
    penetration100m: penetration,
    penetration500m: Math.round(penetration * 0.92),
    speed: 800 + Math.round(random() * 300),
    explosionRadius: null,
    damagePerMinute: Math.round(rateOfFire * damage)
  };

  return {
    modules: {
      gun: `${profile}-gun`,
      turret: `${profile}-turret`,
      engine: `${profile}-engine`,
      chassis: `${profile}-chassis`,
      radio: `${profile}-radio`
    },
    maxHealth: Math.round((80 + tank.tier * 190) * type.hp * (0.9 + random() * 0.2) * factor.maxHealth),
    weight,
    enginePower,
    powerToWeight: round(enginePower / weight, 1),
    speedForward: Math.round(type.speed + random() * 8),
    speedBackward: Math.round(12 + random() * 10),
    hullTraverse: round(24 + random() * 30, 1),
    turretTraverse: round(18 + random() * 30, 1),
    viewRange: Math.round((type.view + random() * 25) * factor.viewRange),
    radioRange: Math.round(550 + random() * 300),
    reloadTime,
    rateOfFire,
    aimingTime: round((1.6 + random() * 1.2) * factor.aimingTime),
    dispersion: round(type.dispersion + random() * 0.08, 3),
    dispersionMovement: round(0.14 + random() * 0.1, 3),
    dispersionHullRotation: round(0.14 + random() * 0.1, 3),
    dispersionTurretRotation: round(0.08 + random() * 0.08, 3),
    elevation: round(15 + random() * 8, 1),
    depression: round(5 + random() * 5, 1),
    clip: null,
    shell,
    shells: [shell]
  };
};

export const mockTopEntries = ({ seed, limit, base }: MockTopEntriesInput): LeaderboardEntry[] => {
  const random = seededRandom(seed);

  return MOCK_PLAYERS.concat(MOCK_PLAYERS)
    .slice(0, limit)
    .map((player, index) => {
      const value = Math.round(base * (1 - index * 0.045) * (0.97 + random() * 0.06));

      return {
        rank: index + 1,
        accountId: player.id + index,
        clanId: null,
        name: index < MOCK_PLAYERS.length ? player.nickname : `${player.nickname}_${index}`,
        clanTag: player.clanTag,
        color: null,
        value,
        tier: ratingTier({ scale: 'wn8', value }),
        battles: Math.round(180 + random() * 1600),
        delta: Math.round((random() - 0.4) * 140)
      };
    });
};

export const mockTankDetail = ({ idOrSlug, period = '30d', mode = 'random' }: TankDetailInput): TankDetail | null => {
  const tank = findMockVehicle(idOrSlug);

  if (!tank) {
    return null;
  }

  return {
    vehicle: mockVehicleSummary(tank),
    description: null,
    specs: null,
    stats: { stock: mockVehicleStats({ tank, profile: 'stock' }), top: mockVehicleStats({ tank, profile: 'top' }) },
    serverStats: (['all', 'beginner', 'average', 'good', 'elite'] as const).flatMap((cohort) =>
      mockStatsRows({ period, cohort, mode }).filter((row) => row.vehicle.tankId === tank.id)
    ),
    moe: mockMoeThreshold({ tank, daysAgo: 0 }),
    mastery: mockMasteryThreshold(tank),
    topPlayers: mockTopEntries({ seed: tank.id, limit: 10, base: 4_200 })
  };
};

const topValueBase = ({ tankId, metric }: MockTopValueInput) => {
  if (metric === 'winRate') {
    return TANK_MOCK.topWinRate;
  }

  return metric === 'avgDamage' ? (findMockVehicle(tankId)?.avgDamage ?? 2_000) * 1.9 : 4_200;
};

export const mockTankTopPlayers = ({ tankId, period = 'overall', metric = 'wn8', limit = 10 }: TankTopPlayersInput): TopPlayers => ({
  tankId,
  period,
  metric,
  entries: mockTopEntries({ seed: tankId + metric.length, limit, base: topValueBase({ tankId, metric }) }).map((entry) =>
    metric === 'wn8' ? entry : { ...entry, tier: null }
  )
});

export const mockTankTrend = ({ tankId, days = TANK_MOCK.trendDays, mode = 'random' }: TankTrendInput): TankTrend => {
  const tank = findMockVehicle(tankId);
  const random = seededRandom(tankId + 17);
  const start = addDays(parseISO(TANK_MOCK.computedAt), -days);

  let winRate = tank?.winRate ?? 50;
  let damage = tank?.avgDamage ?? 2_000;

  const points = Array.from({ length: days }, (_, day) => {
    winRate += (random() - 0.5) * 0.35;
    damage += (random() - 0.5) * damage * 0.02;

    return {
      date: formatISO(addDays(start, day), { representation: 'date' }),
      winRate: round(winRate, 2),
      avgDamage: Math.round(damage),
      battles: Math.round(((tank?.battles ?? 500_000) / 60) * (0.7 + random() * 0.6)),
      players: Math.round(((tank?.battles ?? 500_000) / 900) * (0.7 + random() * 0.6))
    };
  });

  return { tankId, mode, days, points };
};

const verdictOf = (effects: readonly string[]): TankPatchVerdict => {
  const better = effects.includes('better');
  const worse = effects.includes('worse');

  if (better && worse) {
    return 'mixed';
  }

  if (better) {
    return 'buff';
  }

  return worse ? 'nerf' : 'changed';
};

const readSpec = ({ stats, key }: MockSpecInput): number => {
  if (key.startsWith('shells.')) {
    return stats.shell?.penetration100m ?? 0;
  }

  const value = Object.entries(stats).find(([candidate]) => candidate === key)?.[1];

  return typeof value === 'number' ? value : 0;
};

export const mockTankPatches = (tankId: number): TankPatches => {
  const tank = findMockVehicle(tankId);

  if (!tank) {
    return { tankId, patches: [] };
  }

  const random = seededRandom(tankId + 5);
  const stats = mockVehicleStats({ tank, profile: 'top' });

  const patches = TANK_MOCK.patches.map((version, index) => {
    const changes =
      index === 0
        ? []
        : TANK_MOCK.patchKeys
            .filter(() => random() > 0.62)
            .map((key) => {
              const after = readSpec({ stats, key });
              const before = round(after * (1 + (random() - 0.5) * 0.14), 3);
              const isLower = LOWER_IS_BETTER.has(key);
              const effect = before === after ? ('neutral' as const) : after > before !== isLower ? ('better' as const) : ('worse' as const);

              return { key: `top.${key}`, before, after, effect };
            });

    return {
      version,
      title: null,
      date: TANK_MOCK.patchDates[index] ?? TANK_MOCK.computedAt,
      verdict: index === 0 ? ('new' as const) : verdictOf(changes.map(({ effect }) => effect)),
      changes
    };
  });

  return { tankId, patches: patches.reverse() };
};
