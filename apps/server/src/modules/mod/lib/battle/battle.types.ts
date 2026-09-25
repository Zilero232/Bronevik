import type { BattleResultEvent } from '../contract';

export type SessionUuidInput = {
  accountId: bigint;
  sessionId: string;
};

export type BattleDataInput = {
  event: BattleResultEvent;
  accountId: bigint;
  deviceId: string;
  sessionId: string | null;
  previousMoePercent: number | null;
};

export type SessionIncrement = {
  battles: number;
  wins: number;
  losses: number;
  draws: number;
  damageDealt: number;
  damageAssisted: number;
  damageBlocked: number;
  frags: number;
  spotted: number;
  xp: number;
  survived: number;
  credits: number;
};
