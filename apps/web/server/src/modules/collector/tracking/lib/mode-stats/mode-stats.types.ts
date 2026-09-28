import type { Prisma } from '../../../../../../generated';
import type { ModeStatsMode } from '../../../../../common/lib';
import type { AccountStatistics, TankStats } from '../../../../../lib/lesta';

export type AccountModeRowsInput = {
  accountId: bigint;
  statistics: AccountStatistics;
};

export type TankModeRowsInput = {
  accountId: bigint;
  stats: readonly TankStats[];
};

export type AccountModeRow = Omit<Prisma.AccountModeStatsCreateManyInput, 'mode'> & { mode: ModeStatsMode };

export type TankModeRow = Omit<Prisma.TankModeStatsCreateManyInput, 'mode'> & { mode: ModeStatsMode };
