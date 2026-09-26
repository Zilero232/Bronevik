'use client';

import { useQuery } from '@tanstack/react-query';

import { getGuide } from '@/shared/api/guides';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { GUIDE_PAGE } from '../../../config';

export const useGuidePage = (slug: string) => {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.guides.detail(slug),
    queryFn: ({ signal }) => getGuide({ slug, signal }),
    retry: (failures, failure) => !isNotFoundError(failure) && failures < GUIDE_PAGE.retries
  });

  return {
    guide: data ?? null,
    isPending,
    isNotFound: isNotFoundError(error),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
