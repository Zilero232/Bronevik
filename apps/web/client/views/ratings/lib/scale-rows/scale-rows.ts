import { RATING_SCALES, RATING_TIERS } from '@otmetki/ratings';
import { fromKeys } from 'remeda';

import { toneOfTier } from '@/shared/lib';

import type { ScaleRow } from './scale-rows.types';

import { RATING_SCALE_COLUMNS } from '../../config';

export const scaleRows = (): ScaleRow[] =>
  [...RATING_TIERS].reverse().map((tier) => ({
    tier,
    tone: toneOfTier(tier),
    from: fromKeys(RATING_SCALE_COLUMNS, (scale) => RATING_SCALES[scale][RATING_TIERS.indexOf(tier)] ?? 0)
  }));
