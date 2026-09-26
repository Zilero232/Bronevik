'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getDeveloperOverview } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useCurrentPlan = () => {
  const { data: session } = useAuthSession();
  const { data: plan } = useQuery({
    queryKey: QUERY_KEYS.me.developer.overview,
    queryFn: getDeveloperOverview,
    enabled: Boolean(session),
    select: (overview) => overview.plan
  });

  return session ? plan : undefined;
};
