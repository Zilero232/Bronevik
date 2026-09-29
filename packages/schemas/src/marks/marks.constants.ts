export const MOE_HISTORY = {
  maxBatch: 100,
  defaultDays: 30,
  maxDays: 365
} as const;

export const SWEAT_LEVELS = ['easy', 'moderate', 'hard', 'extreme'] as const;

export const MOE_CURVE = {
  windowDays: 14,
  fromPercent: 20,
  toPercent: 100,
  stepPercent: 5,
  bandPercent: 1,
  minPlayers: 5,
  officialPercents: [65, 85, 95, 100]
} as const;
