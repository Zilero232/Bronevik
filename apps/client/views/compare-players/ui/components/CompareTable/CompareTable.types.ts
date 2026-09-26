import type { PlayerComparison, RatingPeriod } from '@otmetki/schemas';

export type CompareTableProps = {
  comparison: PlayerComparison | undefined;
  period: RatingPeriod;
  isLoading: boolean;
};
