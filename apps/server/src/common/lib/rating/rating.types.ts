import type { RATING_SCALE } from './rating.constants';

export type RatingValueInput = {
  kind: keyof typeof RATING_SCALE;
  value: number | null | undefined;
};
