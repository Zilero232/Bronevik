'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { getMapTanks } from '../../../api';

export const useMapTanks = (arenaId: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.maps.tanks(arenaId),
    queryFn: ({ signal }) => getMapTanks({ idOrSlug: arenaId, signal }),
    select: ({ tanks, ...window }) => ({
      ...window,
      rows: tanks.map(({ vehicle, ...sample }) => ({
        ...sample,
        id: String(vehicle.tankId),
        href: ROUTES.tanks.detail(vehicle.slug),
        name: vehicle.shortName || vehicle.name
      }))
    })
  });

  return { query };
};
