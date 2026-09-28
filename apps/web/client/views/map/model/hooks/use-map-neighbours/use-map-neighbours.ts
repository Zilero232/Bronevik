'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { localizedMap, mapQueries } from '@/entities/map/map';

import { mapNeighbours } from '../../../lib/map-neighbours';

export const useMapNeighbours = (arenaId: string) => {
  const locale = useLocale();
  const { data: maps } = useQuery(mapQueries.list());

  const items = (maps ?? []).map((map) => localizedMap({ map, locale }));

  return mapNeighbours({ items, index: items.findIndex((map) => map.arenaId === arenaId) });
};
