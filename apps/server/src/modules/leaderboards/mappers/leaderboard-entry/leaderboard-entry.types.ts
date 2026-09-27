import type { RatingKind } from '@otmetki/schemas';

import type { RankedRow } from '../../leaderboards.types';

export type ToLeaderboardEntryInput = {
  row: RankedRow;
  rank: number;
  scale: RatingKind | null;
};
