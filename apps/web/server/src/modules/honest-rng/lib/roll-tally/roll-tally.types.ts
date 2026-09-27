import type { StoredShot } from '../../../analytics';

export type RollTally = {
  battles: number;
  players: Set<string>;
  shots: number;
  damage: number;
  nominal: number;
  within: number;
  bucketShots: number[];
  fired: number;
  hit: number;
  pierced: number;
};

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
