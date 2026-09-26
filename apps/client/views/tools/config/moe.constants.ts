export const MOE_TARGETS = [
  { value: '1', marks: 1 },
  { value: '2', marks: 2 },
  { value: '3', marks: 3 }
] as const;

export type MoeTargetValue = (typeof MOE_TARGETS)[number]['value'];

export const MOE_CALC = {
  percentRange: { min: 0, max: 99.99, step: 0.01 },
  damageRange: { min: 0, max: 15_000, step: 50 },
  defaults: { percent: 70, damage: 3_000 }
} as const;
