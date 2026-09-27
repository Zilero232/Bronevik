'use client';

import { useQuery } from '@tanstack/react-query';

import { mapQueries } from '@/entities/map/map';

import { mapNeighbours } from '../../../lib/map-neighbours';

export const useMapNeighbours = (arenaId: string) => {
  const { data: maps } = useQuery(mapQueries.list());

  const items = maps ?? [];

  return mapNeighbours({ items, index: items.findIndex((map) => map.arenaId === arenaId) });
};
