'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getDeveloperOverview } from '@/entities/developer/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useApiTier = () => {
  const { data: session } = useAuthSession();
  const { data: tier } = useQuery({
    queryKey: QUERY_KEYS.me.developer.overview,
    queryFn: getDeveloperOverview,
    enabled: Boolean(session),
    select: (overview) => overview.tier
  });

  return session ? tier : undefined;
};
