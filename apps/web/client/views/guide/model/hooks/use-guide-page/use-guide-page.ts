'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getGuide } from '@/entities/guide/guide';
import { QUERY_KEYS } from '@/shared/constants';

export const useGuidePage = (slug: string) => {
  const { data: session, isPending: isSessionPending } = useAuthSession();

  return useQuery({
    queryKey: QUERY_KEYS.guides.detail({ viewerId: session?.user.id ?? null, slug }),
    queryFn: ({ signal }) => getGuide({ slug, signal }),
    enabled: !isSessionPending
  });
};
