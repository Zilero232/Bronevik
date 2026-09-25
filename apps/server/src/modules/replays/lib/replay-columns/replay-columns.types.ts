import type { BattleResult } from '../../../../../generated';

export type ReplayColumns = {
  gameVersion: string | null;
  arenaUniqueId: bigint | null;
  arenaId: string | null;
  mapName: string | null;
  battleType: string | null;
  gameplayMode: string | null;
  accountId: bigint | null;
  tankId: number | null;
  result: BattleResult | null;
  damageDealt: number | null;
  damageAssisted: number | null;
  frags: number | null;
  xp: number | null;
  playedAt: Date | null;
  playerAccountIds: bigint[];
};
