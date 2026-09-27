import type { PlayerComparison, RatingPeriod } from '@otmetki/schemas';

export type UseCompareTableInput = {
  comparison: PlayerComparison | undefined;
  period: RatingPeriod;
};
