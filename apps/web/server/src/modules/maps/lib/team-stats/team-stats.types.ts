import type { MapStats } from '@otmetki/schemas';

import type { BattleResult } from '../../../../../generated';

export type BattleSideRow = {
  team: number | null;
  result: BattleResult;
};

export type WinnerRow = {
  winner: number | null;
  battles: number;
};

export type ToStatsInput = {
  source: MapStats['source'];
  winners: readonly (number | null)[];
};
