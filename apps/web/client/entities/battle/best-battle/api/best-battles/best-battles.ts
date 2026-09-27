import { bestBattlesControllerFacetsOf, bestBattlesControllerList } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { BestBattleFacetsInput, BestBattlesFacets, BestBattlesInput, BestBattlesPage } from './best-battles.types';

export const listBestBattles = ({ signal, ...query }: BestBattlesInput): Promise<BestBattlesPage> =>
  fromSdk(() => bestBattlesControllerList({ query, signal }));

export const getBestBattleFacets = ({ period, signal }: BestBattleFacetsInput): Promise<BestBattlesFacets> =>
  fromSdk(() => bestBattlesControllerFacetsOf({ query: { period }, signal }));
