'use client';

import { useInboxFeedQuery } from '../use-inbox-feed-query';

export const useInboxFeedMore = () => {
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = useInboxFeedQuery();

  return { hasNextPage, isFetchingNextPage, onLoadMore: () => void fetchNextPage() };
};
