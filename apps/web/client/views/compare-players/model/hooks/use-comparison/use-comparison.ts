'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { comparePlayers } from '../../../api';
import { COMPARE_LIMIT } from '../../../config';

export const useComparison = (accountIds: number[]) =>
  useQuery({
    queryKey: QUERY_KEYS.compare.players({ accountIds }),
    queryFn: ({ signal }) => comparePlayers({ accountIds, signal }),
    enabled: accountIds.length >= COMPARE_LIMIT.min,
    placeholderData: keepPreviousData
  });
