'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { clamp } from 'remeda';

import { useAuthSession } from '@/entities/auth/session';
import { listGuides } from '@/entities/guide/guide';
import { QUERY_KEYS } from '@/shared/constants';

import { GUIDE_LIST } from '../../../config';
import { hasActiveFilters, pageCount, toGuideListQuery } from '../../../lib/guide-filters';
import { useGuideFilters } from '../use-guide-filters';

export const useGuideCatalog = () => {
  const { filters, setPage, reset } = useGuideFilters();
  const { data: session } = useAuthSession();
  const [knownTotal, setKnownTotal] = useState<number | null>(null);
  const knownPages = knownTotal === null ? Number.POSITIVE_INFINITY : pageCount({ total: knownTotal, pageSize: GUIDE_LIST.pageSize });
  const queryPage = clamp(filters.page, { min: GUIDE_LIST.firstPage, max: knownPages });
  const params = toGuideListQuery({ filters: { ...filters, page: queryPage }, pageSize: GUIDE_LIST.pageSize });
  const query = useQuery({
    queryKey: QUERY_KEYS.guides.list({ viewerId: session?.user.id ?? null, params }),
    queryFn: ({ signal }) => listGuides({ ...params, signal }),
    placeholderData: keepPreviousData
  });

  const total = query.data?.total ?? 0;
  const pages = pageCount({ total, pageSize: GUIDE_LIST.pageSize });
  const page = clamp(queryPage, { min: GUIDE_LIST.firstPage, max: pages });

  if (query.data && query.data.total !== knownTotal) {
    setKnownTotal(query.data.total);
  }

  return {
    query,
    total,
    page,
    pages,
    hasPrev: page > GUIDE_LIST.firstPage,
    hasNext: page < pages,
    prev: () => setPage(page - 1),
    next: () => setPage(page + 1),
    hasFilters: hasActiveFilters(filters),
    reset
  };
};
