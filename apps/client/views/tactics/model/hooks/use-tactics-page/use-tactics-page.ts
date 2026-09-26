'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { listMyTacticBoards } from '@/shared/api/tactics';
import { QUERY_KEYS } from '@/shared/constants';

export const useTacticsPage = () => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const isSignedIn = Boolean(session);
  const {
    data: boards = [],
    isPending,
    isError,
    isFetching,
    refetch
  } = useQuery({ queryKey: QUERY_KEYS.tactics.mine, queryFn: ({ signal }) => listMyTacticBoards(signal), enabled: isSignedIn });

  const onRetry = () => void refetch();

  return { isSessionPending, isSignedIn, boards, isPending: isSignedIn && isPending, isError, isFetching, onRetry };
};
