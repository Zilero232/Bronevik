import type { VehicleCatalogItem } from '@otmetki/schemas';

import { isIncludedIn, sortBy } from 'remeda';

import type { CollectionVehiclesInput, MatchesCollectionInput, TankCollectionSlug } from './tank-collections.types';

import { TANK_COLLECTION_SLUGS, TANK_COLLECTIONS } from '../../config/tank-collections.constants';

export const isTankCollection = (slug: string): slug is TankCollectionSlug => isIncludedIn(slug, TANK_COLLECTION_SLUGS);

export const matchesCollection = ({ vehicle, criteria: { roles, statuses, tiers, types, isPreferential } }: MatchesCollectionInput): boolean =>
  (roles === undefined || (vehicle.role !== null && roles.includes(vehicle.role))) &&
  (statuses === undefined || statuses.includes(vehicle.status)) &&
  (tiers === undefined || tiers.includes(vehicle.tier)) &&
  (types === undefined || types.includes(vehicle.type)) &&
  (isPreferential === undefined || vehicle.isPreferential === isPreferential);

export const collectionVehicles = ({ catalog, slug }: CollectionVehiclesInput): VehicleCatalogItem[] =>
  sortBy(
    catalog.filter((vehicle) => matchesCollection({ vehicle, criteria: TANK_COLLECTIONS[slug] })),
    [({ tier }) => tier, 'desc'],
    ({ name }) => name
  );
