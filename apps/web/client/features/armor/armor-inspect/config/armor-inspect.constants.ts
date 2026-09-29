import { PENETRATION } from '@otmetki/gamedata';

export const ARMOR_INSPECT = {
  distance: { min: 0, max: 565, step: 5, initial: 100 },
  randomness: { lesta: PENETRATION.randomness, client: PENETRATION.clientRandomness }
} as const;

export const RANDOMNESS_KEYS = ['lesta', 'client'] as const;

export const ARMOR_LAYERS = ['hull', 'turret', 'gun', 'chassis', 'spaced'] as const;

export const SHELL_KIND_KEYS = {
  ARMOR_PIERCING: 'ap',
  ARMOR_PIERCING_CR: 'apcr',
  HOLLOW_CHARGE: 'heat',
  HIGH_EXPLOSIVE: 'he'
} as const;
