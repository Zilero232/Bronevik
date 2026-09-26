'use client';

import { useEffect } from 'react';

import type { UseFetchAllPagesInput } from './use-fetch-all-pages.types';

export const useFetchAllPages = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseFetchAllPagesInput) => {
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
};
