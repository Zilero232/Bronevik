import type { AccountAchievements, Player } from '../../../../../generated';

export type CollectorSourceRow = Pick<AccountAchievements, 'accountId' | 'completion' | 'held' | 'points'> & {
  player: Pick<Player, 'clanId' | 'nickname'>;
};

export type CollectorRowInput = {
  row: CollectorSourceRow;
  rank: number;
  clanTag: string | null;
};
