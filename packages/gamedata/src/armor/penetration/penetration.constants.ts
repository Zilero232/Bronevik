export const SHELL_KINDS = ['ARMOR_PIERCING', 'ARMOR_PIERCING_CR', 'HOLLOW_CHARGE', 'HIGH_EXPLOSIVE'] as const;

export const SHELL_KIND_ALIASES: Readonly<Record<string, (typeof SHELL_KINDS)[number]>> = {
  ARMOR_PIERCING_HE: 'ARMOR_PIERCING'
};

export const SHELL_RULES = {
  ARMOR_PIERCING: { normalization: 5, ricochetAngle: 70, caliberRules: true, distanceFalloff: true, jetLossPerMeter: 0 },
  ARMOR_PIERCING_CR: { normalization: 2, ricochetAngle: 70, caliberRules: true, distanceFalloff: true, jetLossPerMeter: 0 },
  HOLLOW_CHARGE: { normalization: 0, ricochetAngle: 85, caliberRules: false, distanceFalloff: false, jetLossPerMeter: 0.5 },
  HIGH_EXPLOSIVE: { normalization: 0, ricochetAngle: null, caliberRules: false, distanceFalloff: false, jetLossPerMeter: 0 }
} as const;

export const PENETRATION = {
  randomness: 0.25,
  clientRandomness: 0.15,
  twoCaliberRatio: 2,
  twoCaliberFactor: 1.4,
  overmatchRatio: 3,
  falloffNear: 100,
  falloffFar: 500,
  heShieldReduction: 3,
  maxEffective: 9999,
  sigmaShare: 0.5,
  chanceIterations: 32
} as const;

export const ERF_APPROXIMATION = {
  p: 0.3275911,
  a1: 0.254829592,
  a2: -0.284496736,
  a3: 1.421413741,
  a4: -1.453152027,
  a5: 1.061405429
} as const;
