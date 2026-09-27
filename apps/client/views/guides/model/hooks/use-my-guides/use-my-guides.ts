'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getMyGuides } from '@/entities/guide/guide';
import { QUERY_KEYS } from '@/shared/constants';

export const useMyGuides = () => {
  const { data: session } = useAuthSession();
  const query = useQuery({
    queryKey: QUERY_KEYS.guides.mine({ viewerId: session?.user.id ?? null }),
    queryFn: ({ signal }) => getMyGuides(signal),
    enabled: Boolean(session)
  });

  return {
    isSignedIn: Boolean(session),
    query
  };
};
