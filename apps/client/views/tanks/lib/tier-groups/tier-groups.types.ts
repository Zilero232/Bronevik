import type { TierListEntry, TierListRank } from '@otmetki/schemas';

export type TierGroup = {
  rank: TierListRank;
  entries: TierListEntry[];
};
