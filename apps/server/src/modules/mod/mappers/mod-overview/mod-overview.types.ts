import type { LatestSessionRow, OverallRatingRow } from '../../selects';

export type ModOverviewInput = {
  accountId: bigint;
  rating: OverallRatingRow | null;
  session: LatestSessionRow | null;
};
