'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { mapQueries } from '@/entities/map/map';

import { mapNeighbours } from '../../../lib/map-neighbours';

export const useMapNeighbours = (arenaId: string) => {
  const locale = useLocale();
  const { data: items = [] } = useQuery(mapQueries.localizedList(locale));

  return mapNeighbours({ items, index: items.findIndex((map) => map.arenaId === arenaId) });
};
