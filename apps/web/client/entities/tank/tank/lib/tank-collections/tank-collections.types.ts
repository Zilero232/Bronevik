import type { VehicleCatalogItem, VehicleFilter } from '@otmetki/schemas';

import type { TANK_COLLECTION_SLUGS } from '../../config';

type ListCriteria = { [K in 'roles' | 'statuses' | 'tiers' | 'types']?: readonly NonNullable<VehicleFilter[K]>[number][] };

export type TankCollectionCriteria = ListCriteria & Partial<Pick<VehicleCatalogItem, 'isPreferential'>>;

export type TankCollectionSlug = (typeof TANK_COLLECTION_SLUGS)[number];

export type MatchesCollectionInput = {
  vehicle: VehicleCatalogItem;
  criteria: TankCollectionCriteria;
};

export type CollectionVehiclesInput = {
  catalog: readonly VehicleCatalogItem[];
  slug: TankCollectionSlug;
};
