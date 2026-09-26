import type { IconGroup, MarkCount, MasteryLevel, TankClassVariant } from '@bronevik/icons';

import type { TankImageSize } from '@/entities/tank/tank';

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

export const RENDER_SAMPLES = [
  { key: 'big', size: 'big', source: 'flagship', withImages: true },
  { key: 'small', size: 'small', source: 'flagship', withImages: true },
  { key: 'contour', size: 'contour', source: 'flagship', withImages: true },
  { key: 'premium', size: 'big', source: 'premium', withImages: true },
  { key: 'fallback', size: 'big', source: 'premium', withImages: false },
  { key: 'fallback-row', size: 'contour', source: 'flagship', withImages: false }
] as const satisfies readonly { key: string; size: TankImageSize; source: 'flagship' | 'premium'; withImages: boolean }[];
