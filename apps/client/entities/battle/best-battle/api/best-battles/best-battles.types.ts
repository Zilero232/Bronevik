import type { BestBattlesControllerListData, BestBattlesPage } from '@/shared/api/generated';

export type { BestBattlesFacets, BestBattlesPage } from '@/shared/api/generated';

export type BestBattle = BestBattlesPage['items'][number];

export type BestBattleMedal = BestBattle['medals'][number];

export type BestBattlesQuery = NonNullable<BestBattlesControllerListData['query']>;

export type BestBattlePeriod = NonNullable<BestBattlesQuery['period']>;

export type BestBattleMetric = NonNullable<BestBattlesQuery['metric']>;

export type BestBattlesInput = BestBattlesQuery & {
  signal?: AbortSignal;
};

export type BestBattleFacetsInput = {
  period: BestBattlePeriod;
  signal?: AbortSignal;
};
