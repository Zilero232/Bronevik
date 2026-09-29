'use client';

import { useQuery } from '@tanstack/react-query';

import type { TankCollectionSlug } from '@/entities/tank/tank';

import { collectionVehicles, vehicleCatalogQuery } from '@/entities/tank/tank';

import { groupByTier } from '../../../lib/catalog-filter';

export const useTankCollectionPage = (slug: TankCollectionSlug) =>
  useQuery({
    ...vehicleCatalogQuery(),
    select: (catalog) => {
      const vehicles = collectionVehicles({ catalog, slug });

      return { groups: groupByTier(vehicles), shown: vehicles.length };
    }
  });
