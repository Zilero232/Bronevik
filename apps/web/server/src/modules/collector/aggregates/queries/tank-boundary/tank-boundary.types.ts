import type { StatsMode } from '../../../../../../generated';

export type TankBoundarySqlInput = {
  accountId: bigint;
  mode: StatsMode;
  cutoff: Date;
};
