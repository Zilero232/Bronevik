import type { BadgeTone } from '@/ui-kit';

export const MAP_CAMOUFLAGES = ['summer', 'winter', 'desert'] as const;

export const CAMOUFLAGE_TONE = {
  summer: 'success',
  winter: 'steel',
  desert: 'warning'
} as const satisfies Record<(typeof MAP_CAMOUFLAGES)[number], BadgeTone>;
