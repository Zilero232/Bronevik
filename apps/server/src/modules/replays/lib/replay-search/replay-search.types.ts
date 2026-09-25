import type { ReplaySearchQuery } from '../../replays.types';

export type SearchWhereInput = {
  query: ReplaySearchQuery;
  playerAccountId: bigint | null;
};
