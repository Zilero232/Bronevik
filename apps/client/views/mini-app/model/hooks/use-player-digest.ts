'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlayer, getPlayerMarks, getPlayerSessions } from '@/shared/api/players';
import { QUERY_KEYS } from '@/shared/constants';

import { MINI_APP } from '../../config';

export const usePlayerDigest = (accountId: number) => {
  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.player.profile(String(accountId)),
    queryFn: ({ signal }) => getPlayer({ idOrNick: String(accountId), signal })
  });

  const { data: sessions } = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId, section: 'sessions', params: { limit: MINI_APP.sessionsLimit } }),
    queryFn: ({ signal }) => getPlayerSessions({ accountId, limit: MINI_APP.sessionsLimit, offset: 0, signal })
  });

  const { data: marks } = useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId, section: 'marks' }),
    queryFn: ({ signal }) => getPlayerMarks({ accountId, signal })
  });

  return { profile, session: sessions ? (sessions.items.at(0) ?? null) : undefined, marks };
};
