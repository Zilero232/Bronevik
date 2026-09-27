import type { EconomyTableQueryInput, TankStatsQueryInput, TierListQueryInput } from '../tanks-queries';

export type TanksPrefetchInput = {
  stats: TankStatsQueryInput;
  tierList?: TierListQueryInput;
  economy?: EconomyTableQueryInput;
};
