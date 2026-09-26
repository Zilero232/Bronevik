'use client';

import { useQuery } from '@tanstack/react-query';

import { shopControllerListNewsOptions } from '@/shared/api/query-options';

import { HOME } from '../../../config';

export const useGameNews = () => {
  const { data, isPending, isError, refetch } = useQuery({
    ...shopControllerListNewsOptions({ query: { limit: HOME.news.limit } }),
    staleTime: HOME.staleMs
  });

  return { items: data?.items ?? [], isPending, isError, retry: () => void refetch() };
};
