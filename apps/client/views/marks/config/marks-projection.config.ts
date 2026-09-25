export const MOE_PROJECTION = {
  overshoot: 1.2,
  minBattles: 30,
  maxBattles: 600,
  fallbackBattles: 300,
  maxPoints: 60,
  chartHeight: 260,
  debounceMs: 250,
  defaults: { percent: 72, damage: 3_200, marks: 2 },
  percentRange: { min: 0, max: 99.99, step: 0.01 },
  damageRange: { min: 0, max: 15_000, step: 50 }
} as const;

export const TARGET_MARKS = [
  { value: '1', marks: 1 },
  { value: '2', marks: 2 },
  { value: '3', marks: 3 }
] as const;
