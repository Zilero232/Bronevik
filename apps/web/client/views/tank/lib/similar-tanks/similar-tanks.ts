import type { VehicleCatalogItem } from '@otmetki/schemas';

import { sortBy } from 'remeda';

import type { SimilarTanksInput } from './similar-tanks.types';

export const similarTanks = ({ catalog, vehicle, limit }: SimilarTanksInput): VehicleCatalogItem[] => {
  const role = catalog.find(({ tankId }) => tankId === vehicle.tankId)?.role ?? null;

  return sortBy(
    catalog.filter(({ tankId, tier, type }) => tankId !== vehicle.tankId && tier === vehicle.tier && type === vehicle.type),
    [(item) => (role !== null && item.role === role ? 0 : 1), 'asc'],
    [({ nation }) => (nation === vehicle.nation ? 0 : 1), 'asc'],
    [({ isPremium }) => (isPremium === vehicle.isPremium ? 0 : 1), 'asc'],
    ({ name }) => name
  ).slice(0, limit);
};
