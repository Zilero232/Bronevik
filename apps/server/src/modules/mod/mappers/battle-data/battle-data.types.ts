import type { BattleResultEvent } from '../../lib/contract';

export type BattleDataInput = {
  event: BattleResultEvent;
  accountId: bigint;
  deviceId: string;
  sessionId: string | null;
  previousMoePercent: number | null;
};
