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
  const query = toGuideListQuery({ filters: { ...filters, page: queryPage }, pageSize: GUIDE_LIST.pageSize });
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.guides.list({ viewerId: session?.user.id ?? null, params: query }),
    queryFn: ({ signal }) => listGuides({ ...query, signal }),
    placeholderData: keepPreviousData
  });

  const total = data?.total ?? 0;
  const pages = pageCount({ total, pageSize: GUIDE_LIST.pageSize });
  const page = clamp(queryPage, { min: GUIDE_LIST.firstPage, max: pages });

  if (data && data.total !== knownTotal) {
    setKnownTotal(data.total);
  }

  return {
    items: data?.items ?? [],
    total,
    page,
    pages,
    hasPrev: page > GUIDE_LIST.firstPage,
    hasNext: page < pages,
    prev: () => setPage(page - 1),
    next: () => setPage(page + 1),
    hasFilters: hasActiveFilters(filters),
    reset,
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
