'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getPlayer, getPlayerMarks, getPlayerSessions, PLAYERS_REQUEST } from '../../../api';

export const usePlayerDigest = (accountId: number | null) => {
  const id = accountId ?? 0;
  const enabled = accountId !== null;

  const profileQuery = useQuery({
    queryKey: QUERY_KEYS.player.profile(String(id)),
    queryFn: ({ signal }) => getPlayer({ idOrNick: String(id), signal }),
    enabled
  });

  const sessionsQuery = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId: id, section: 'sessions', params: { limit: PLAYERS_REQUEST.digestSessionsLimit } }),
    queryFn: ({ signal }) => getPlayerSessions({ accountId: id, limit: PLAYERS_REQUEST.digestSessionsLimit, offset: 0, signal }),
    enabled
  });

  const marksQuery = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId: id, section: 'marks' }),
    queryFn: ({ signal }) => getPlayerMarks({ accountId: id, signal }),
    enabled
  });

  const queries = [profileQuery, sessionsQuery, marksQuery];
  const sessions = sessionsQuery.data;

  return {
    profile: profileQuery.data,
    session: sessions ? (sessions.items.at(0) ?? null) : undefined,
    marks: marksQuery.data,
    profileError: profileQuery.error,
    isError: queries.some(({ isError }) => isError),
    isRetrying: queries.some(({ isFetching }) => isFetching),
    retry: () => {
      queries
        .filter(({ isError }) => isError)
        .forEach(({ refetch }) => {
          void refetch();
        });
    }
  };
};
