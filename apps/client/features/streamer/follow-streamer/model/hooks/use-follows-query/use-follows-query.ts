'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';

import { getMyFollows } from '../../../api';

export const useFollowsQuery = () => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const { data, isPending } = useQuery({ queryKey: QUERY_KEYS.me.streamer.follows, queryFn: getMyFollows, enabled: Boolean(session) });

  const isSignedIn = Boolean(session);

  return {
    isSignedIn,
    follows: data ?? [],
    isPending: isSessionPending || (isSignedIn && isPending)
  };
};
