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
  maxEffective: 9999
} as const;
