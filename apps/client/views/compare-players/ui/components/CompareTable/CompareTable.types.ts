import type { PlayerComparison, RatingPeriod } from '@bronevik/schemas';

export type CompareTableProps = {
  comparison: PlayerComparison | undefined;
  period: RatingPeriod;
  isLoading: boolean;
};
