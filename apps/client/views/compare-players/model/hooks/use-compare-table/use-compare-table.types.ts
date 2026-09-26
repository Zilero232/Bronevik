import type { PlayerComparison, RatingPeriod } from '@bronevik/schemas';

export type UseCompareTableInput = {
  comparison: PlayerComparison | undefined;
  period: RatingPeriod;
};
