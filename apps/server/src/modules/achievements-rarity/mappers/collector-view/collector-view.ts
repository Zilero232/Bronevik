import type { CollectorRow } from '../../achievements-rarity.types';
import type { CollectorRowInput } from './collector-view.types';

export const toCollectorRow = ({ row, rank, clanTag }: CollectorRowInput): CollectorRow => ({
  rank,
  accountId: Number(row.accountId),
  nickname: row.player.nickname,
  clanTag,
  held: row.held,
  points: row.points,
  completion: row.completion
});
