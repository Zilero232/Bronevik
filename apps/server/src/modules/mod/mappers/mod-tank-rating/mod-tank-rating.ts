import type { ModTankRating } from '@otmetki/schemas';

import { clamp } from 'remeda';

import type { ModTankRatingInput } from './mod-tank-rating.types';

import { clampPercent, percentOf, ratingValue, ratio } from '../../../../common/lib';
import { MOD_RATINGS_READ } from '../../config';

const winRateOf = ({ tank, rating, totals }: ModTankRatingInput): number | null => {
  if (totals) {
    return percentOf({ value: totals.wins, by: totals.battles });
  }

  if (tank) {
    return percentOf({ value: tank.wins, by: tank.battles });
  }

  return rating && rating.battles > 0 ? clampPercent(rating.winRate) : null;
};

const avgDamageOf = ({ rating, totals }: ModTankRatingInput): number | null => {
  if (totals) {
    return ratio({ value: Math.max(0, totals.damageDealt), by: totals.battles });
  }

  return rating && rating.battles > 0 ? Math.max(0, rating.avgDamage) : null;
};

const marksOf = ({ tank, totals }: ModTankRatingInput): number | null => {
  const marks = tank?.marksOnGun ?? totals?.marksOnGun ?? null;

  return marks === null ? null : clamp(marks, { min: 0, max: MOD_RATINGS_READ.maxMarksOnGun });
};

export const toModTankRating = (input: ModTankRatingInput): ModTankRating | null => {
  const { tankId, tank, rating, totals } = input;

  if (!tank && !rating && !totals) {
    return null;
  }

  return {
    tank_id: tankId,
    battles: Math.max(0, totals?.battles ?? tank?.battles ?? rating?.battles ?? 0),
    win_rate: winRateOf(input),
    avg_damage: avgDamageOf(input),
    wn8: ratingValue({ kind: 'wn8', value: rating?.wn8 }),
    moe_percent: clampPercent(tank?.moePercent),
    marks_on_gun: marksOf(input),
    mastery: clamp(tank?.markOfMastery ?? totals?.markOfMastery ?? 0, { min: 0, max: MOD_RATINGS_READ.maxMastery })
  };
};
