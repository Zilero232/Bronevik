import type {
  MyTanksControllerEconomyData,
  TanksControllerDetailData,
  TanksControllerEconomyTableData,
  TanksControllerListData,
  TanksControllerTierListData,
  TanksControllerTopData,
  TanksControllerTrendData
} from '@/shared/api/generated';

export type VehicleCatalogInput = {
  signal?: AbortSignal;
};

type TankIdInput = VehicleCatalogInput & {
  tankId: number;
};

export type TankStatsInput = NonNullable<TanksControllerListData['query']> & VehicleCatalogInput;

export type TierListInput = NonNullable<TanksControllerTierListData['query']> & VehicleCatalogInput;

export type TankDetailInput = NonNullable<TanksControllerDetailData['query']> &
  VehicleCatalogInput & {
    idOrSlug: string;
  };

export type TankTopPlayersInput = NonNullable<TanksControllerTopData['query']> & TankIdInput;

export type TankTrendInput = NonNullable<TanksControllerTrendData['query']> & TankIdInput;

export type TankPatchesInput = TankIdInput;

export type TankEconomyTableInput = NonNullable<TanksControllerEconomyTableData['query']> & VehicleCatalogInput;

export type TankEconomyInput = TankIdInput;

export type MyEconomyInput = Required<NonNullable<MyTanksControllerEconomyData['query']>> & VehicleCatalogInput;

export type MyLearningInput = TankIdInput;
