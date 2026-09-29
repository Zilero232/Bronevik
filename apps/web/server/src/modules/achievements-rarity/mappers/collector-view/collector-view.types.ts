import type { AccountAchievements, Player } from '../../../../../generated';

type CollectorSourceRow = Pick<AccountAchievements, 'accountId' | 'completion' | 'held' | 'points'> & {
  player: Pick<Player, 'clanId' | 'nickname'>;
};

export type CollectorRowInput = {
  row: CollectorSourceRow;
  rank: number;
  clanTag: string | null;
};
