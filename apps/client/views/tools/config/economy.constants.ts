import { ShellApIcon, ShellHeatIcon, ShellHeIcon } from '@otmetki/icons';

import type { EconomyTier } from './economy.types';

export const ECONOMY_TIERS: Readonly<Record<number, EconomyTier>> = {
  1: { base: 1_800, perDamage: 3, perSpotting: 2, repair: 60, ap: 10, heat: 280, he: 8 },
  2: { base: 2_600, perDamage: 3.5, perSpotting: 2.2, repair: 250, ap: 20, heat: 560, he: 15 },
  3: { base: 3_400, perDamage: 4, perSpotting: 2.4, repair: 600, ap: 45, heat: 1_120, he: 35 },
  4: { base: 4_800, perDamage: 4.5, perSpotting: 2.7, repair: 1_400, ap: 75, heat: 1_600, he: 60 },
  5: { base: 6_200, perDamage: 5, perSpotting: 3, repair: 2_600, ap: 140, heat: 2_000, he: 110 },
  6: { base: 7_800, perDamage: 5.3, perSpotting: 3.2, repair: 4_400, ap: 250, heat: 2_400, he: 200 },
  7: { base: 9_600, perDamage: 5.6, perSpotting: 3.4, repair: 6_800, ap: 400, heat: 2_800, he: 320 },
  8: { base: 12_000, perDamage: 6, perSpotting: 3.8, repair: 10_000, ap: 700, heat: 3_200, he: 560 },
  9: { base: 15_500, perDamage: 6.4, perSpotting: 4.2, repair: 14_500, ap: 1_000, heat: 4_000, he: 800 },
  10: { base: 19_000, perDamage: 6.8, perSpotting: 4.6, repair: 19_500, ap: 1_200, heat: 4_800, he: 1_000 }
};

export const ECONOMY = {
  premiumAccount: 1.5,
  premiumVehicle: { income: 1.4, repair: 0.85 },
  consumablePrice: { standard: 3_000, premium: 20_000 },
  tierRange: { min: 1, max: 10, step: 1 },
  damageRange: { min: 0, max: 10_000, step: 50 },
  shellRange: { min: 0, max: 60, step: 1 },
  priceRange: { min: 0, max: 20_000, step: 10 },
  consumableRange: { min: 0, max: 3, step: 1 },
  defaults: { tier: 10, damage: 3_000, spotting: 900, ap: 9, heat: 3, he: 0, standard: 1, premium: 1 }
} as const;

export const SHELL_KINDS = ['ap', 'heat', 'he'] as const;

export type ShellKind = (typeof SHELL_KINDS)[number];

export const SHELL_ICONS = { ap: ShellApIcon, heat: ShellHeatIcon, he: ShellHeIcon } as const satisfies Record<ShellKind, unknown>;
