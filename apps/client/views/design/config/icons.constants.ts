import type { IconGroup, MarkCount, MasteryLevel, TankClassVariant } from '@otmetki/icons';

import type { TankImageSize } from '@/entities/tank/tank';

export const DESIGN_ICONS = {
  sizes: ['16', '24', '32', '48'] as const,
  strokes: ['1.25', '1.75', '2'] as const,
  defaultSize: '32',
  defaultStroke: '1.75',
  groupOrder: [
    'brand',
    'classes',
    'silhouettes',
    'nations',
    'marks',
    'mastery',
    'modes',
    'misc',
    'crew',
    'equipment'
  ] as const satisfies readonly IconGroup[],
  classVariants: ['regular', 'premium', 'elite'] as const satisfies readonly TankClassVariant[],
  masteryLevels: ['third', 'second', 'first', 'master'] as const satisfies readonly MasteryLevel[],
  markCounts: [1, 2, 3] as const satisfies readonly MarkCount[],
  animatedSize: 64,
  animatedStroke: 1.5,
  renderSkeleton: { height: 96, width: 160 },
  renderSamples: [
    { key: 'big', size: 'big', source: 'flagship', withImages: true },
    { key: 'small', size: 'small', source: 'flagship', withImages: true },
    { key: 'contour', size: 'contour', source: 'flagship', withImages: true },
    { key: 'premium', size: 'big', source: 'premium', withImages: true },
    { key: 'fallback', size: 'big', source: 'premium', withImages: false },
    { key: 'fallback-row', size: 'contour', source: 'flagship', withImages: false }
  ] as const satisfies readonly { key: string; size: TankImageSize; source: 'flagship' | 'premium'; withImages: boolean }[]
} as const;
