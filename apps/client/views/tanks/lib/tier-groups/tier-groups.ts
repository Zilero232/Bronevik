import type { TierListEntry } from '@bronevik/schemas';

import { tierListRankSchema } from '@bronevik/schemas';

import type { TierGroup } from './tier-groups.types';

export const groupByRank = (entries: readonly TierListEntry[]): TierGroup[] =>
  tierListRankSchema.options
    .map((rank) => ({ rank, entries: entries.filter((entry) => entry.rank === rank) }))
    .filter(({ entries: group }) => group.length > 0);
