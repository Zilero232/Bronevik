'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { listTournaments } from '@/entities/tournament/tournament';
import { QUERY_KEYS } from '@/shared/constants';
import { useOffsetInfiniteList } from '@/shared/lib';

import { TOURNAMENT_FILTERS, TOURNAMENT_LIST } from '../../../config';

export const useTournamentList = () => {
  const [filter, setFilter] = useQueryState(
    'status',
    parseAsStringLiteral(TOURNAMENT_FILTERS).withDefault(TOURNAMENT_LIST.defaultFilter).withOptions({ history: 'replace' })
  );

  const status = filter === 'all' ? undefined : filter;
  const list = useOffsetInfiniteList({
    queryKey: QUERY_KEYS.tournaments.list({ status, limit: TOURNAMENT_LIST.pageSize }),
    queryFn: ({ offset, signal }) => listTournaments({ status, limit: TOURNAMENT_LIST.pageSize, offset, signal })
  });

  return {
    list,
    filter,
    onFilterChange: (next: (typeof TOURNAMENT_FILTERS)[number]) => void setFilter(next)
  };
};
