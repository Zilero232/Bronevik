import type {
  AccountEconomy,
  MyTankLearning,
  TankDetail,
  TankEconomy,
  TankEconomyPage,
  TankPatches,
  TankStatsPage,
  TankTrend,
  TierList,
  TopPlayers,
  VehicleCatalog
} from '@otmetki/schemas';

import type {
  MyEconomyInput,
  MyLearningInput,
  TankDetailInput,
  TankEconomyInput,
  TankEconomyTableInput,
  TankPatchesInput,
  TankStatsInput,
  TankTopPlayersInput,
  TankTrendInput,
  TierListInput,
  VehicleCatalogInput
} from './tanks.types';

import {
  myTanksControllerEconomy,
  myTanksControllerLearning,
  tanksControllerDetail,
  tanksControllerEconomyTable,
  tanksControllerList,
  tanksControllerPatches,
  tanksControllerTankEconomy,
  tanksControllerTierList,
  tanksControllerTop,
  tanksControllerTrend,
  vehiclesControllerList
} from '../generated';
import { listParam } from '../http';
import { fromSdk } from '../source';
import { TANK_REQUEST } from './tanks.constants';

export const listTankStats = ({ signal, tiers, types, nations, statuses, roles, ...query }: TankStatsInput): Promise<TankStatsPage> =>
  fromSdk(() =>
    tanksControllerList({
      query: {
        ...query,
        tiers: listParam(tiers),
        types: listParam(types),
        nations: listParam(nations),
        statuses: listParam(statuses),
        roles: listParam(roles)
      },
      signal
    })
  );

export const listTankEconomy = ({ signal, tiers, types, nations, statuses, roles, ...query }: TankEconomyTableInput): Promise<TankEconomyPage> =>
  fromSdk(() =>
    tanksControllerEconomyTable({
      query: {
        ...query,
        tiers: listParam(tiers),
        types: listParam(types),
        nations: listParam(nations),
        statuses: listParam(statuses),
        roles: listParam(roles)
      },
      signal
    })
  );

export const getTankEconomy = ({ signal, tankId }: TankEconomyInput): Promise<TankEconomy> =>
  fromSdk(() => tanksControllerTankEconomy({ path: { id: tankId }, signal }));

export const getMyEconomy = ({ signal, days }: MyEconomyInput): Promise<AccountEconomy> =>
  fromSdk(() => myTanksControllerEconomy({ query: { days }, signal }));

export const getMyTankLearning = ({ signal, tankId }: MyLearningInput): Promise<MyTankLearning> =>
  fromSdk(() => myTanksControllerLearning({ path: { id: tankId }, signal }));

export const getTierList = ({ signal, ...query }: TierListInput): Promise<TierList> => fromSdk(() => tanksControllerTierList({ query, signal }));

export const getTank = ({ signal, idOrSlug, ...query }: TankDetailInput): Promise<TankDetail> =>
  fromSdk(() => tanksControllerDetail({ path: { idOrSlug }, query, signal }));

export const getTankTopPlayers = ({ signal, tankId, ...query }: TankTopPlayersInput): Promise<TopPlayers> =>
  fromSdk(() => tanksControllerTop({ path: { id: tankId }, query, signal }));

export const getTankTrend = ({ signal, tankId, days = TANK_REQUEST.trendDays, mode }: TankTrendInput): Promise<TankTrend> =>
  fromSdk(() => tanksControllerTrend({ path: { id: tankId }, query: { days, mode }, signal }));

export const getTankPatches = ({ signal, tankId }: TankPatchesInput): Promise<TankPatches> =>
  fromSdk(() => tanksControllerPatches({ path: { id: tankId }, signal }));

export const listVehicles = ({ signal }: VehicleCatalogInput): Promise<VehicleCatalog> => fromSdk(() => vehiclesControllerList({ signal }));
