import type { RngDaily } from '../../../../../generated';
import type { StoredShot } from '../../../analytics';

export type RollTally = Omit<RngDaily, 'day' | 'players' | 'scope'> & { players: Set<string> };

export type BattleAccuracy = {
  fired: number;
  hit: number;
  pierced: number;
};

export type FoldBattleInput = {
  tally: RollTally;
  accountId: string;
  shots: readonly StoredShot[];
  accuracy: BattleAccuracy | null;
};

export type MergeTallyInput = {
  into: RollTally;
  from: RollTally;
};
