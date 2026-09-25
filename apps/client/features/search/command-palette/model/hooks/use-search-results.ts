'use client';

import { SEARCH } from '@bronevik/schemas';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { search, SEARCH_REQUEST } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { countSearchGroups, groupSearchResults } from '../../lib/group-results';

export const useSearchResults = (query: string) => {
  const debounced = useDebounceValue(query.trim(), SEARCH_REQUEST.debounceMs);

  const isEnabled = debounced.length >= SEARCH.minLength;

  const {
    data: response,
    isFetching,
    isError
  } = useQuery({
    queryKey: QUERY_KEYS.search(debounced),
    queryFn: ({ signal }) => search({ query: debounced, signal }),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000
  });

  const results = isEnabled && response ? groupSearchResults(response.results) : undefined;

  return { results, total: results ? countSearchGroups(results) : 0, isEnabled, isFetching: isEnabled && isFetching, isError };
};
