'use client';

import { useQuery } from '@tanstack/react-query';

import { getLeaderboard } from '@/entities/player/leaderboard';
import { getPlayer, getPlayerSession, getPlayerSessions } from '@/entities/player/profile';
import { QUERY_KEYS } from '@/shared/constants';

import { PREVIEW_OVERLAY, PREVIEW_OVERLAY_CONFIG } from '../../../config';
import { previewOverlayData } from '../../../lib/preview-overlay';

export const useOverlaySample = () => {
  const {
    data: leaderboard,
    isSuccess: isLeaderboardReady,
    isError: isLeaderboardError,
    isFetching: isLeaderboardFetching,
    refetch: refetchLeaderboard
  } = useQuery({
    queryKey: QUERY_KEYS.leaderboard(PREVIEW_OVERLAY.leaderboard),
    queryFn: ({ signal }) => getLeaderboard({ ...PREVIEW_OVERLAY.leaderboard, signal })
  });

  const accountId = leaderboard?.entries[0]?.accountId ?? null;
  const idOrNick = accountId === null ? '' : String(accountId);

  const {
    data: profile,
    isError: isProfileError,
    isFetching: isProfileFetching,
    refetch: refetchProfile
  } = useQuery({
    queryKey: QUERY_KEYS.player.profile(idOrNick),
    queryFn: ({ signal }) => getPlayer({ idOrNick, signal }),
    enabled: accountId !== null
  });

  const {
    data: sessions,
    isError: isSessionsError,
    isSuccess: isSessionsReady
  } = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId: accountId ?? 0, section: 'sessions', params: PREVIEW_OVERLAY.sessions }),
    queryFn: ({ signal }) => getPlayerSessions({ accountId: accountId ?? 0, ...PREVIEW_OVERLAY.sessions, signal }),
    enabled: accountId !== null
  });

  const sessionId = sessions?.items[0]?.id ?? null;

  const { data: session, isPending: isSessionPending } = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId: accountId ?? 0, section: 'session', params: { sessionId } }),
    queryFn: ({ signal }) => getPlayerSession({ accountId: accountId ?? 0, sessionId: sessionId ?? '', signal }),
    enabled: accountId !== null && sessionId !== null
  });

  const isSessionSettled = isSessionsError || (isSessionsReady && (sessionId === null || !isSessionPending));
  const data = profile && isSessionSettled ? previewOverlayData({ profile, session: session ?? null, config: PREVIEW_OVERLAY_CONFIG }) : undefined;

  return {
    nickname: profile?.summary.nickname ?? null,
    query: {
      data: isLeaderboardReady && accountId === null ? null : data,
      isError: isLeaderboardError || isProfileError,
      isRefetching: isLeaderboardFetching || isProfileFetching,
      refetch: () => (isLeaderboardError ? refetchLeaderboard() : refetchProfile())
    }
  };
};
