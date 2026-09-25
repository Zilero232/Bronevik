import type { BadgeTone } from '@/ui-kit';

export const MAP_CAMOUFLAGES = ['summer', 'winter', 'desert'] as const;

export const CAMOUFLAGE_TONE: Record<(typeof MAP_CAMOUFLAGES)[number], BadgeTone> = {
  summer: 'success',
  winter: 'steel',
  desert: 'warning'
};
