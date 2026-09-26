'use client';

import { CLAN_LIST } from '@otmetki/schemas';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

import { listClans } from '@/shared/api/clans';
import { QUERY_KEYS } from '@/shared/constants';

import { CLAN_RATING } from '../../../config';

export const useClanSearch = () => {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault('').withOptions({ history: 'replace' }));
  const debounced = useDebounceValue(query.trim().slice(0, CLAN_LIST.maxSearchLength), CLAN_RATING.searchDebounceMs);
  const isEnabled = debounced.length >= CLAN_LIST.minSearchLength;
  const {
    data: page,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.clans.list({ search: debounced, limit: CLAN_RATING.searchLimit }),
    queryFn: ({ signal }) => listClans({ search: debounced, sort: 'members', limit: CLAN_RATING.searchLimit, signal }),
    enabled: isEnabled,
    placeholderData: keepPreviousData
  });

  const results = isEnabled ? (page?.items.map(({ clan }) => clan) ?? []) : [];

  return { query, setQuery, results, isEnabled, isFetching, isError, refetch };
};
