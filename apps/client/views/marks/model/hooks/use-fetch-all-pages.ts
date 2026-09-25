'use client';

import { useEffect } from 'react';

type UseFetchAllPagesInput = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

export const useFetchAllPages = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseFetchAllPagesInput) => {
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
};
