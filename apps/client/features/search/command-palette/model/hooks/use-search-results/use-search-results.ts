'use client';

import { SEARCH } from '@otmetki/schemas';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { search, SEARCH_REQUEST } from '@/entities/search/search';
import { QUERY_KEYS } from '@/shared/constants';

import { COMMAND_PALETTE } from '../../../config';
import { countSearchGroups, groupSearchResults } from '../../../lib/group-results';

export const useSearchResults = (query: string) => {
  const debounced = useDebounceValue(query.trim(), SEARCH_REQUEST.debounceMs);

  const isEnabled = debounced.length >= SEARCH.minLength;

  const {
    data: response,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.search(debounced),
    queryFn: ({ signal }) => search({ query: debounced, signal }),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    staleTime: COMMAND_PALETTE.searchStaleMs
  });

  const results = isEnabled && response ? groupSearchResults(response.results) : undefined;

  return {
    results,
    total: results ? countSearchGroups(results) : 0,
    isEnabled,
    isFetching: isEnabled && isFetching,
    isError,
    retry: () => refetch()
  };
};
