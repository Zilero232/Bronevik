import type { PlaySession } from '../../../../../generated';

export type SessionUuidInput = {
  accountId: bigint;
  sessionId: string;
};

export type SessionIncrement = Pick<
  PlaySession,
  'battles' | 'damageAssisted' | 'damageBlocked' | 'damageDealt' | 'draws' | 'frags' | 'losses' | 'spotted' | 'survived' | 'wins' | 'xp'
> & {
  credits: number;
};
