import type { Battle } from '../../../../../generated';

export type CompetitionBattlesSqlInput = {
  accountId: bigint;
  battleTypes: readonly string[];
  from: Date;
  until: Date;
  limit: number;
};

export type CompetitionBattleRow = Pick<
  Battle,
  'damageAssistedRadio' | 'damageAssistedTrack' | 'damageBlocked' | 'damageDealt' | 'frags' | 'result' | 'spotted' | 'survived' | 'tankId' | 'xp'
>;
