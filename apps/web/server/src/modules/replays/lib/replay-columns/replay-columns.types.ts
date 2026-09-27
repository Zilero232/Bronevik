import type { Replay } from '../../../../../generated';

export type ReplayColumns = Pick<
  Replay,
  | 'accountId'
  | 'arenaId'
  | 'arenaUniqueId'
  | 'battleType'
  | 'damageAssisted'
  | 'damageDealt'
  | 'frags'
  | 'gameplayMode'
  | 'gameVersion'
  | 'mapName'
  | 'playedAt'
  | 'playerAccountIds'
  | 'result'
  | 'tankId'
  | 'xp'
>;
