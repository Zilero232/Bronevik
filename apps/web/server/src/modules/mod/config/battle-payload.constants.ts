export const MOD_SHOTS = {
  maxPerBattle: 200,
  maxDamage: 10_000,
  maxDistanceM: 1_500,
  shells: ['armor_piercing', 'armor_piercing_cr', 'hollow_charge', 'high_explosive', 'unknown'],
  outcomes: ['damage', 'no_damage', 'miss']
} as const;

export const MOD_ACHIEVEMENTS = {
  maxPerBattle: 64,
  maxNameLength: 64
} as const;

export const MOD_PLATOON = {
  minSize: 2,
  maxSize: 3
} as const;
