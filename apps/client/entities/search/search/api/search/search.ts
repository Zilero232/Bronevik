import type { SearchResponse } from '@otmetki/schemas';

import { SEARCH } from '@otmetki/schemas';

import { searchControllerSearch } from '@/shared/api/generated';

import type { SearchInput } from './search.types';

import { SEARCH_REQUEST } from './search.constants';

export const search = async ({ query, signal }: SearchInput): Promise<SearchResponse> => {
  const trimmed = query.trim();

  if (trimmed.length < SEARCH.minLength) {
    return { query: trimmed, correctedQuery: null, results: [] };
  }

  const { data } = await searchControllerSearch({ query: { q: trimmed, limit: SEARCH_REQUEST.limit }, signal });

  return data;
};
