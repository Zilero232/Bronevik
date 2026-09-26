'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import type { RecruitingKind } from '@/shared/api/recruiting';

import { listRecruiting } from '@/shared/api/recruiting';
import { QUERY_KEYS } from '@/shared/constants';
import { nextPageOffset } from '@/shared/lib';

import { RECRUITING_BOARD } from '../../../config';

export const useRecruitingBoard = (kind: RecruitingKind) => {
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.recruiting.list({ kind, limit: RECRUITING_BOARD.pageSize }),
    queryFn: ({ signal, pageParam }) => listRecruiting({ kind, limit: RECRUITING_BOARD.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    placeholderData: keepPreviousData
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    items,
    total: data?.pages[0]?.total ?? 0,
    isPending,
    isError,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
