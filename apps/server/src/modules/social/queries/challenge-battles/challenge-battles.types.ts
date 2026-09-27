import type { Battle } from '../../../../../generated';

export type ChallengeBattlesSqlInput = {
  accountIds: readonly bigint[];
  start: Date;
  end: Date;
};

export type ChallengeBattleRow = Pick<Battle, 'accountId' | 'damageDealt' | 'tankId'>;
