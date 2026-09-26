export const FRONTLINE_RESERVES = ['artilleryStrike', 'airStrike', 'reconFlight', 'inspire', 'smokeScreen', 'engineering', 'minefield'] as const;

export type FrontlineReserve = (typeof FRONTLINE_RESERVES)[number];

export const FRONTLINE_GAME = {
  maxLevel: 30,
  maxPrestige: 10,
  xpToNextLevel: [
    5_000, 5_500, 6_000, 6_500, 7_000, 7_500, 8_000, 8_500, 9_000, 9_500, 10_000, 10_500, 11_000, 11_500, 12_000, 12_500, 13_000, 13_500, 14_000,
    14_500, 15_000, 15_500, 16_000, 16_500, 17_000, 17_500, 18_000, 18_500, 19_000
  ],
  reserveUnlockLevel: {
    artilleryStrike: 1,
    airStrike: 1,
    reconFlight: 5,
    inspire: 10,
    smokeScreen: 15,
    engineering: 20,
    minefield: 25
  }
} as const satisfies {
  maxLevel: number;
  maxPrestige: number;
  xpToNextLevel: readonly number[];
  reserveUnlockLevel: Record<FrontlineReserve, number>;
};

export const FRONTLINE = {
  ranges: {
    level: { min: 1, max: FRONTLINE_GAME.maxLevel, step: 1 },
    levelXp: { min: 0, max: 50_000, step: 100 },
    battleXp: { min: 0, max: 10_000, step: 50 },
    prestige: { min: 0, max: FRONTLINE_GAME.maxPrestige, step: 1 },
    battlesPerDay: { min: 1, max: 60, step: 1 }
  },
  defaults: { level: 1, levelXp: 0, battleXp: 2_000, prestige: 0, targetPrestige: 1, battlesPerDay: 10 }
} as const;

export const FRONTLINE_FIELDS = [
  { key: 'level', range: FRONTLINE.ranges.level },
  { key: 'levelXp', range: FRONTLINE.ranges.levelXp },
  { key: 'battleXp', range: FRONTLINE.ranges.battleXp },
  { key: 'prestige', range: FRONTLINE.ranges.prestige },
  { key: 'targetPrestige', range: FRONTLINE.ranges.prestige }
] as const;
