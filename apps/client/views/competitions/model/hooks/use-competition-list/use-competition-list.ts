'use client';

import { parseAsBoolean, parseAsStringLiteral, useQueryStates } from 'nuqs';

import { useAuthSession } from '@/entities/auth/session';
import { listCompetitions } from '@/entities/competition/competition';
import { QUERY_KEYS } from '@/shared/constants';
import { useOffsetInfiniteList } from '@/shared/lib';

import { COMPETITION_FILTERS, COMPETITION_LIST } from '../../../config';

export const useCompetitionList = () => {
  const { data: session } = useAuthSession();
  const [{ status: filter, mine: isMineParam }, setParams] = useQueryStates(
    {
      status: parseAsStringLiteral(COMPETITION_FILTERS).withDefault(COMPETITION_LIST.defaultFilter),
      mine: parseAsBoolean.withDefault(false)
    },
    { history: 'replace' }
  );

  const isSignedIn = Boolean(session);
  const isMine = isSignedIn && isMineParam;
  const status = filter === 'all' ? undefined : filter;
  const params = { status, mine: isMine || undefined, limit: COMPETITION_LIST.pageSize };
  const list = useOffsetInfiniteList({
    queryKey: QUERY_KEYS.competitions.list(params),
    queryFn: ({ offset, signal }) => listCompetitions({ ...params, offset, signal })
  });

  return {
    ...list,
    filter,
    isMine,
    isSignedIn,
    onFilterChange: (next: (typeof COMPETITION_FILTERS)[number]) => void setParams({ status: next }),
    onMineChange: (next: boolean) => void setParams({ mine: next })
  };
};
