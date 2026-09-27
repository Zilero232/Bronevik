import type { ComputeTankUsageInput } from '../../aggregates.types';

export type BuildRanksSqlInput = Pick<ComputeTankUsageInput, 'battleTypes' | 'since'>;

export type BuildRankRow = {
  tank_id: number;
  account_id: bigint;
  rank: number;
};
