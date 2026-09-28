import type { Prisma } from '../../../../../../generated';
import type { TankMarks } from '../../lib/marks-gain';

export type { AccountModeRow, TankModeRow } from '../../lib/mode-stats';

export type PlayerTankUpsertRow = Pick<
  Prisma.PlayerTankCreateManyInput,
  'accountId' | 'battles' | 'lastBattleAt' | 'markOfMastery' | 'tankId' | 'wins'
>;

export type LatestTanksSqlInput = {
  accountId: bigint;
  capturedAt: Date;
};

export type SyncedRow = {
  accountId: number;
  lastBattleAt: Date | null;
  lastPolledAt: Date;
  nextPollAt: Date;
};

export type MarksRow = TankMarks;
