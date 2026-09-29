import type { WrappedBestBattleSqlInput } from '../wrapped-best-battle';

export type WrappedTopTanksSqlInput = WrappedBestBattleSqlInput & {
  limit: number;
};

export type WrappedTankRow = {
  tank_id: number;
  battles: number;
  damage: bigint;
};
