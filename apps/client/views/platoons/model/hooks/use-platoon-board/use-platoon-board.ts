'use client';

import { QUERY_KEYS } from '@/shared/constants';
import { useOffsetInfiniteList } from '@/shared/lib';

import { listPlatoons } from '../../../api';
import { PLATOON_BOARD } from '../../../config';
import { toPlatoonQuery } from '../../../lib/platoon-query';
import { usePlatoonFilters } from '../use-platoon-filters';

export const usePlatoonBoard = () => {
  const { filters, isFiltered, onReset } = usePlatoonFilters();
  const query = toPlatoonQuery(filters);
  const list = useOffsetInfiniteList({
    queryKey: QUERY_KEYS.platoons.list({ ...query, limit: PLATOON_BOARD.pageSize }),
    queryFn: ({ offset, signal }) => listPlatoons({ ...query, limit: PLATOON_BOARD.pageSize, offset, signal })
  });

  return { list, isFiltered, onReset };
};
