'use client';

import type { SearchResult } from '@bronevik/schemas';

import { SEARCH } from '@bronevik/schemas';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { search, SEARCH_REQUEST } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { PickableKind, PickableResult, UseEntitySearchInput } from './use-entity-search.types';

const isKind =
  <K extends PickableKind>(kind: K) =>
  (result: SearchResult): result is PickableResult<K> & SearchResult =>
    result.kind === kind;

export const useEntitySearch = <K extends PickableKind>({ kind, query }: UseEntitySearchInput<K>) => {
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
    staleTime: 30_000
  });

  const results: PickableResult<K>[] = isEnabled && response ? response.results.filter(isKind(kind)) : [];

  return { results, isEnabled, isFetching: isEnabled && isFetching, isError, retry: () => refetch() };
};
