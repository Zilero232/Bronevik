'use client';

import type { PlayMode } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getMyModeStats } from '@/entities/mode/mode';
import { usePlus } from '@/features/plus/plus-gate';
import { QUERY_KEYS } from '@/shared/constants';

import { MY_MODE } from '../../../config';
import { myModeStatus, shouldRetryMyMode } from '../../../lib/my-mode-status';

export const useMyModeStats = (mode: PlayMode) => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const { isPlus } = usePlus();
  const {
    data: stats,
    isPending,
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.modes.mine(MY_MODE.days),
    queryFn: ({ signal }) => getMyModeStats({ days: MY_MODE.days, signal }),
    enabled: Boolean(session) && isPlus,
    retry: (failureCount, queryError) => shouldRetryMyMode({ failureCount, error: queryError })
  });

  const line = stats?.modes.find((item) => item.mode === mode) ?? null;

  return {
    status: myModeStatus({ isSignedIn: Boolean(session), isSessionPending, isPending, error, line }),
    line,
    tanks: line?.tanks.slice(0, MY_MODE.tanks) ?? [],
    days: stats?.days ?? MY_MODE.days,
    isRetrying: isFetching,
    onRetry: () => void refetch()
  };
};
