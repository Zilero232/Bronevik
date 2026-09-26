'use client';

import { useQuery } from '@tanstack/react-query';

import { getMap } from '@/entities/map/map';
import { QUERY_KEYS } from '@/shared/constants';

export const useMapDetail = (idOrSlug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.maps.detail(idOrSlug),
    queryFn: ({ signal }) => getMap({ idOrSlug, signal }),
    retry: false
  });
