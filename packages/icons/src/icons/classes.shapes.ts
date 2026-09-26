import type { TankClassKind } from './icons.types';

import { laurelBranches, rhombusBands } from '../lib';

const CENTER = { cx: 12, cy: 12 } as const;

export const CLASS_GLYPHS = {
  lightTank: rhombusBands({ ...CENTER, halfWidth: 7, halfHeight: 9.5, bands: 1, gap: 0 }),
  mediumTank: rhombusBands({ ...CENTER, halfWidth: 7.5, halfHeight: 10, bands: 2, gap: 1.6 }),
  heavyTank: rhombusBands({ ...CENTER, halfWidth: 8, halfHeight: 10.5, bands: 3, gap: 1.4 }),
  'AT-SPG': ['M4 6h16L12 19Z'],
  SPG: ['M6.5 6.5h11v11h-11Z'],
  assaultSPG: ['M6.5 10 12 5l5.5 5v7.5h-11Z']
} as const satisfies Record<TankClassKind, string[]>;

export const CLASS_SLUGS = {
  lightTank: 'light',
  mediumTank: 'medium',
  heavyTank: 'heavy',
  'AT-SPG': 'td',
  SPG: 'spg',
  assaultSPG: 'spg-assault'
} as const satisfies Record<TankClassKind, string>;

export const CLASS_VARIANT = {
  premiumFill: 'var(--otmetki-class-premium, #ffeecc)',
  premiumGlow: 'drop-shadow(0 0 1.6px var(--otmetki-class-glow, #ff5500))',
  eliteColor: 'var(--otmetki-class-elite, #d9b25c)',
  eliteTransform: 'translate(12 11.2) scale(0.58) translate(-12 -12)',
  laurel: laurelBranches({ cx: 12, cy: 12, radius: 8.4, leaves: 7 })
} as const;
