'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { clamp } from 'remeda';

import { listGuides } from '@/shared/api/guides';
import { QUERY_KEYS } from '@/shared/constants';

import { GUIDE_LIST } from '../../../config';
import { hasActiveFilters, pageCount, toGuideListQuery } from '../../../lib/guide-filters';
import { useGuideFilters } from '../use-guide-filters';

export const useGuideCatalog = () => {
  const { filters, setPage, reset } = useGuideFilters();
  const query = toGuideListQuery({ filters, pageSize: GUIDE_LIST.pageSize });
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.guides.list(query),
    queryFn: ({ signal }) => listGuides({ ...query, signal }),
    placeholderData: keepPreviousData
  });

  const total = data?.total ?? 0;
  const pages = pageCount({ total, pageSize: GUIDE_LIST.pageSize });
  const page = clamp(filters.page, { min: GUIDE_LIST.firstPage, max: pages });

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
