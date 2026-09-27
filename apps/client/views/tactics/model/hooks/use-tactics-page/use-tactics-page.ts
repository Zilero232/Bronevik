'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { listMyTacticBoards } from '@/entities/tactic/board';
import { QUERY_KEYS } from '@/shared/constants';

export const useTacticsPage = () => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const isSignedIn = Boolean(session);
  const query = useQuery({
    queryKey: QUERY_KEYS.tactics.mine,
    queryFn: ({ signal }) => listMyTacticBoards(signal),
    enabled: isSignedIn
  });

  return { isGuest: !isSessionPending && !isSignedIn, isSignedIn, query };
};
