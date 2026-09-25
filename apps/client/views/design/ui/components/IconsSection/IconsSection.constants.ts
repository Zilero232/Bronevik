import type { IconGroup, MarkCount, MasteryLevel, TankClassVariant } from '@bronevik/icons';

import type { TankIdentityData, TankImageSize } from '@/entities/tank/tank';

import { MOCK_TANKS } from '@/shared/mocks';

export const ICON_SIZES = ['16', '24', '32', '48'] as const;

export const ICON_STROKES = ['1.25', '1.75', '2'] as const;

export const ICON_GROUP_ORDER = [
  'brand',
  'classes',
  'silhouettes',
  'nations',
  'marks',
  'mastery',
  'modes',
  'misc'
] as const satisfies readonly IconGroup[];

export const CLASS_VARIANTS = ['regular', 'premium', 'elite'] as const satisfies readonly TankClassVariant[];

export const MASTERY_LEVELS = ['third', 'second', 'first', 'master'] as const satisfies readonly MasteryLevel[];

export const MARK_COUNTS = [1, 2, 3] as const satisfies readonly MarkCount[];

const [flagship] = MOCK_TANKS;

const premium = MOCK_TANKS.find((tank) => tank.isPremium) ?? flagship;

export const RENDER_SAMPLES: { key: string; size: TankImageSize; tank: TankIdentityData }[] = [
  { key: 'big', size: 'big', tank: flagship },
  { key: 'small', size: 'small', tank: flagship },
  { key: 'contour', size: 'contour', tank: flagship },
  { key: 'premium', size: 'big', tank: premium },
  { key: 'fallback', size: 'big', tank: { ...premium, images: null } },
  { key: 'fallback-row', size: 'contour', tank: { ...flagship, images: null } }
];
