'use client';

import { useQuery } from '@tanstack/react-query';

import { listMaps } from '@/entities/map/map';
import { QUERY_KEYS } from '@/shared/constants';

import { mapNeighbours } from '../../../lib/map-neighbours';

export const useMapNeighbours = (arenaId: string) => {
  const { data: maps } = useQuery({
    queryKey: QUERY_KEYS.maps.list,
    queryFn: ({ signal }) => listMaps({ signal })
  });

  const items = maps ?? [];

  return mapNeighbours({ items, index: items.findIndex((map) => map.arenaId === arenaId) });
};
