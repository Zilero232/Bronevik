import { COMPETITION_MODES } from '@otmetki/schemas';

import type { MapRotation } from '@/shared/api/generated';
import type { RatingTone } from '@/shared/lib';

export const MAP_STATS = {
  modes: COMPETITION_MODES satisfies readonly MapRotation['mode'][],
  defaultMode: 'random',
  allTiers: 0,
  tiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  hours: 24,
  hourTickEvery: 3,
  waitTones: ['great', 'good', 'average', 'below', 'bad'] satisfies readonly RatingTone[],
  evenWaitPosition: 0.5,
  compact: { tier: 0, mode: 'random' },
  compactTopMaps: 5,
  staleMs: 5 * 60_000
} as const;
