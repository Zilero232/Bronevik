'use client';

import { useQuery } from '@tanstack/react-query';

import { getClanStronghold } from '@/shared/api/clans';
import { QUERY_KEYS } from '@/shared/constants';

export const useClanStronghold = (clanId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.clans.stronghold(clanId),
    queryFn: ({ signal }) => getClanStronghold({ clanId, signal }),
    retry: 1
  });
