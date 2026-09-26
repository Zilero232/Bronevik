'use client';

import { useQuery } from '@tanstack/react-query';

import { getLeaderboard } from '@/entities/player/leaderboard';
import { getPlayer, getPlayerSession, getPlayerSessions } from '@/entities/player/profile';
import { QUERY_KEYS } from '@/shared/constants';

import { PREVIEW_OVERLAY, PREVIEW_OVERLAY_CONFIG } from '../../../config';
import { previewOverlayData } from '../../../lib/preview-overlay';

export const useOverlaySample = () => {
  const leaderboard = useQuery({
    queryKey: QUERY_KEYS.leaderboard(PREVIEW_OVERLAY.leaderboard),
    queryFn: ({ signal }) => getLeaderboard({ ...PREVIEW_OVERLAY.leaderboard, signal })
  });

  const accountId = leaderboard.data?.entries[0]?.accountId ?? null;
  const idOrNick = accountId === null ? '' : String(accountId);

  const profile = useQuery({
    queryKey: QUERY_KEYS.player.profile(idOrNick),
    queryFn: ({ signal }) => getPlayer({ idOrNick, signal }),
    enabled: accountId !== null
  });

  const sessions = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId: accountId ?? 0, section: 'sessions', params: PREVIEW_OVERLAY.sessions }),
    queryFn: ({ signal }) => getPlayerSessions({ accountId: accountId ?? 0, ...PREVIEW_OVERLAY.sessions, signal }),
    enabled: accountId !== null
  });

  const sessionId = sessions.data?.items[0]?.id ?? null;

  const session = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId: accountId ?? 0, section: 'session', params: { sessionId } }),
    queryFn: ({ signal }) => getPlayerSession({ accountId: accountId ?? 0, sessionId: sessionId ?? '', signal }),
    enabled: accountId !== null && sessionId !== null
  });

  const isSessionSettled = sessions.isError || (sessions.isSuccess && (sessionId === null || !session.isPending));
  const data =
    profile.data && isSessionSettled
      ? previewOverlayData({ profile: profile.data, session: session.data ?? null, config: PREVIEW_OVERLAY_CONFIG })
      : null;

  return {
    data,
    nickname: profile.data?.summary.nickname ?? null,
    isEmpty: leaderboard.isSuccess && accountId === null,
    isError: leaderboard.isError || profile.isError,
    isRetrying: leaderboard.isFetching || profile.isFetching,
    retry: () => void (leaderboard.isError ? leaderboard.refetch() : profile.refetch())
  };
};
