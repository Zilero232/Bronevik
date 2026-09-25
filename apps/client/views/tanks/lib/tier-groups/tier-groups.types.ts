import type { TierListEntry, TierListRank } from '@bronevik/schemas';

export type TierGroup = {
  rank: TierListRank;
  entries: TierListEntry[];
};
