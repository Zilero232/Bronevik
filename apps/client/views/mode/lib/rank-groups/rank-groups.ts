import type { ModeTank } from '@otmetki/schemas';

import { MODE_RANKS } from '@otmetki/schemas';

import type { RankGroup } from './rank-groups.types';

export const groupByRank = (tanks: readonly ModeTank[]): RankGroup[] =>
  [...MODE_RANKS, null].map((rank) => ({ rank, tanks: tanks.filter((tank) => tank.rank === rank) })).filter(({ tanks: group }) => group.length > 0);
