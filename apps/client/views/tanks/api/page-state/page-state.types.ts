import type { EconomyTableParams, TankStatsParams, TierListParams } from '../tanks-queries';

export type TanksPrefetchInput = {
  stats: TankStatsParams;
  tierList?: TierListParams;
  economy?: EconomyTableParams;
};
