import type { RatingScale, RatingTier } from '@otmetki/ratings';

import type { RatingTone } from '@/shared/lib';

import type { RATING_SCALE_COLUMNS } from '../../config';

type ScaleColumn = (typeof RATING_SCALE_COLUMNS)[number] & RatingScale;

export type ScaleRow = {
  tier: RatingTier;
  tone: RatingTone;
  from: Record<ScaleColumn, number>;
};
