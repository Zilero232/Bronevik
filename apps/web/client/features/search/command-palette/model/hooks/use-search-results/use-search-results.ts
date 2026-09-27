'use client';

import { useDebouncedSearch } from '@/entities/search/search';

import { countSearchGroups, groupSearchResults } from '../../../lib/group-results';

export const useSearchResults = (query: string) => {
  const { data: results, ...state } = useDebouncedSearch({ query, select: (response) => groupSearchResults(response.results) });

  return { results, total: results ? countSearchGroups(results) : 0, ...state };
};
