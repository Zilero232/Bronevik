import type { ModeRank } from '@otmetki/schemas';

import type { RatingTone } from '@/shared/lib';

export const MODE_RANK_TONE = {
  S: 'unicum',
  A: 'great',
  B: 'good',
  C: 'average',
  D: 'below'
} as const satisfies Record<ModeRank, RatingTone>;
