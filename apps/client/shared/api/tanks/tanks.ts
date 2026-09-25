import type { TankDetail, TankPatches, TankStatsPage, TankTrend, TierList, TopPlayers, VehicleCatalog } from '@bronevik/schemas';

import {
  tankDetailSchema,
  tankPatchesSchema,
  tankStatsPageSchema,
  tankTrendSchema,
  tierListSchema,
  topPlayersSchema,
  vehicleCatalogSchema
} from '@bronevik/schemas';

import type {
  TankDetailInput,
  TankPatchesInput,
  TankStatsInput,
  TankTopPlayersInput,
  TankTrendInput,
  TierListInput,
  VehicleCatalogInput
} from './tanks.types';

import { api, joinList, orNotFound } from '../http';
import { fromSource } from '../source';
import { mockTankDetail, mockTankPatches, mockTankTopPlayers, mockTankTrend } from './tank-detail.mock';
import { TANK_REQUEST } from './tanks.constants';
import { mockTankStats, mockTierList, mockVehicleCatalog } from './tanks.mock';

export const listTankStats = ({ signal, ...input }: TankStatsInput): Promise<TankStatsPage> =>
  fromSource({
    signal,
    mock: () => mockTankStats(input),
    fetch: async () => {
      const { tiers, types, nations, ...rest } = input;
      const { data } = await api.get('/tanks', {
        params: { ...rest, tiers: joinList(tiers), types: joinList(types), nations: joinList(nations) },
        signal
      });

      return tankStatsPageSchema.parse(data);
    }
  });

export const getTierList = ({ signal, ...params }: TierListInput): Promise<TierList> =>
  fromSource({
    signal,
    mock: () => mockTierList(params),
    fetch: async () => {
      const { data } = await api.get('/tanks/tier-list', { params, signal });

      return tierListSchema.parse(data);
    }
  });

export const getTank = ({ signal, idOrSlug, ...params }: TankDetailInput): Promise<TankDetail> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockTankDetail({ idOrSlug, ...params })),
    fetch: async () => {
      const { data } = await api.get(`/tanks/${encodeURIComponent(idOrSlug)}`, { params, signal });

      return tankDetailSchema.parse(data);
    }
  });

export const getTankTopPlayers = ({ signal, tankId, ...params }: TankTopPlayersInput): Promise<TopPlayers> =>
  fromSource({
    signal,
    mock: () => mockTankTopPlayers({ tankId, ...params }),
    fetch: async () => {
      const { data } = await api.get(`/tanks/${tankId}/top-players`, { params, signal });

      return topPlayersSchema.parse(data);
    }
  });

export const getTankTrend = ({ signal, tankId, days = TANK_REQUEST.trendDays, mode }: TankTrendInput): Promise<TankTrend> =>
  fromSource({
    signal,
    mock: () => mockTankTrend({ tankId, days, mode }),
    fetch: async () => {
      const { data } = await api.get(`/tanks/${tankId}/trend`, { params: { days, mode }, signal });

      return tankTrendSchema.parse(data);
    }
  });

export const getTankPatches = ({ signal, tankId }: TankPatchesInput): Promise<TankPatches> =>
  fromSource({
    signal,
    mock: () => mockTankPatches(tankId),
    fetch: async () => {
      const { data } = await api.get(`/tanks/${tankId}/patches`, { signal });

      return tankPatchesSchema.parse(data);
    }
  });

export const listVehicles = ({ signal }: VehicleCatalogInput): Promise<VehicleCatalog> =>
  fromSource({
    signal,
    mock: mockVehicleCatalog,
    fetch: async () => {
      const { data } = await api.get('/vehicles', { signal });

      return vehicleCatalogSchema.parse(data);
    }
  });
