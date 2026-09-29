import type { MarkPair } from '../../lib';

export type PreviousBattleMarksInput = {
  pairs: readonly MarkPair[];
  since: Date;
};

export type PreviousBattleMarksRow = MarkPair & {
  marksOnGun: number;
};
