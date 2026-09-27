'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';
import { useClientNow, weekKey } from '@/shared/lib';

import { getLeague } from '../../../api';
import { LEAGUE_VIEW } from '../../../config';
import { leagueStanding, leagueWeekNav } from '../../../lib/league-table';
import { useLeagueParams } from '../use-league-params';

export const useLeague = () => {
  const { data: session } = useAuthSession();
  const params = useLeagueParams();
  const now = useClientNow();
  const isFriends = params.scope === 'friends';
  const query = useQuery({
    queryKey: QUERY_KEYS.social.league({ scope: params.scope, metric: isFriends ? params.metric : null, week: params.week }),
    queryFn: ({ signal }) => getLeague({ scope: params.scope, metric: params.metric, week: params.week ?? undefined, signal }),
    enabled: Boolean(session),
    placeholderData: (previous) => (previous?.scope === params.scope ? previous : undefined),
    staleTime: LEAGUE_VIEW.staleMs
  });

  const { data: league } = query;
  const currentWeek = now ? weekKey({ date: now }) : null;
  const nav = league ? leagueWeekNav({ weekStart: league.weekStart, currentWeek }) : null;

  return {
    query,
    params,
    isFriends,
    metric: league?.metric ?? params.metric,
    entries: league?.entries ?? [],
    division: league?.division ?? null,
    standing: league ? leagueStanding(league.entries) : null,
    weekStart: league?.weekStart ?? null,
    nav,
    onPrevious: () => nav && params.onWeekChange(nav.previous),
    onNext: () => nav?.next && params.onWeekChange(nav.next === currentWeek ? null : nav.next)
  };
};
