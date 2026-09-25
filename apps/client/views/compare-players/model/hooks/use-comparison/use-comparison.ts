'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { comparePlayers } from '@/shared/api/compare';
import { QUERY_KEYS } from '@/shared/constants';

import { COMPARE_LIMIT } from '../../../config';

export const useComparison = (accountIds: number[]) =>
  useQuery({
    queryKey: QUERY_KEYS.comparePlayers({ accountIds }),
    queryFn: ({ signal }) => comparePlayers({ accountIds, signal }),
    enabled: accountIds.length >= COMPARE_LIMIT.min,
    placeholderData: keepPreviousData
  });
