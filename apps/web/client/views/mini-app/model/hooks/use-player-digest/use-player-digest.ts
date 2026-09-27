'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlayer, getPlayerMarks, getPlayerSessions } from '@/entities/player/profile';
import { QUERY_KEYS } from '@/shared/constants';

import { MINI_APP } from '../../../config';
import { closestMarks } from '../../../lib/dashboard-picks';

export const usePlayerDigest = (accountId: number) => {
  const profileQuery = useQuery({
    queryKey: QUERY_KEYS.player.profile(String(accountId)),
    queryFn: ({ signal }) => getPlayer({ idOrNick: String(accountId), signal })
  });

  const sessionsQuery = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId, section: 'sessions', params: { limit: MINI_APP.sessionsLimit } }),
    queryFn: ({ signal }) => getPlayerSessions({ accountId, limit: MINI_APP.sessionsLimit, offset: 0, signal })
  });

  const marksQuery = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId, section: 'marks' }),
    queryFn: ({ signal }) => getPlayerMarks({ accountId, signal })
  });

  const queries = [profileQuery, sessionsQuery, marksQuery];
  const sessions = sessionsQuery.data;
  const marks = marksQuery.data;

  return {
    profile: profileQuery.data,
    session: sessions ? (sessions.items.at(0) ?? null) : undefined,
    marks: marks ? { summary: marks.summary, chases: closestMarks({ items: marks.items, limit: MINI_APP.marksLimit }) } : undefined,
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
