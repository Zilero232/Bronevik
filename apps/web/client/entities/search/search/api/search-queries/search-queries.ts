import { SEARCH } from '@otmetki/schemas';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { search, SEARCH_REQUEST } from '../search';

export const searchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.search(query),
    queryFn: ({ signal }) => search({ query, signal }),
    enabled: query.length >= SEARCH.minLength,
    placeholderData: keepPreviousData,
    staleTime: SEARCH_REQUEST.staleMs
  });
