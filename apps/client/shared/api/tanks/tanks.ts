import type { TankDetail, TankPatches, TankStatsPage, TankTrend, TierList, TopPlayers, VehicleCatalog } from '@otmetki/schemas';

import type {
  TankDetailInput,
  TankPatchesInput,
  TankStatsInput,
  TankTopPlayersInput,
  TankTrendInput,
  TierListInput,
  VehicleCatalogInput
} from './tanks.types';

import {
  tanksControllerDetail,
  tanksControllerList,
  tanksControllerPatches,
  tanksControllerTierList,
  tanksControllerTop,
  tanksControllerTrend,
  vehiclesControllerList
} from '../generated';
import { listParam } from '../http';
import { fromSdk } from '../source';
import { TANK_REQUEST } from './tanks.constants';

export const listTankStats = ({ signal, tiers, types, nations, ...query }: TankStatsInput): Promise<TankStatsPage> =>
  fromSdk(() => tanksControllerList({ query: { ...query, tiers: listParam(tiers), types: listParam(types), nations: listParam(nations) }, signal }));

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
