import type { Battle } from '../../../../../generated';

export type WrappedBestBattleSqlInput = {
  accountId: bigint;
  start: Date;
  end: Date;
};

export type WrappedBestBattleRow = Pick<Battle, 'arenaUniqueId' | 'damageDealt' | 'frags' | 'id' | 'startedAt' | 'tankId'>;
