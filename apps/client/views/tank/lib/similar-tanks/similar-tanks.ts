import type { VehicleSummary } from '@otmetki/schemas';

import { sortBy } from 'remeda';

import type { SimilarTanksInput } from './similar-tanks.types';

export const similarTanks = ({ catalog, vehicle, limit }: SimilarTanksInput): VehicleSummary[] =>
  sortBy(
    catalog.filter(({ tankId, tier, type }) => tankId !== vehicle.tankId && tier === vehicle.tier && type === vehicle.type),
    [({ nation }) => (nation === vehicle.nation ? 0 : 1), 'asc'],
    [({ isPremium }) => (isPremium === vehicle.isPremium ? 0 : 1), 'asc'],
    ({ name }) => name
  ).slice(0, limit);
