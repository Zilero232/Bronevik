'use client';

import { useQuery } from '@tanstack/react-query';

import { getClan } from '@/shared/api/clans';
import { QUERY_KEYS } from '@/shared/constants';

export const useClanPage = (tag: string) =>
  useQuery({
    queryKey: QUERY_KEYS.clans.page(tag),
    queryFn: ({ signal }) => getClan({ idOrTag: tag, signal }),
    retry: false
  });
