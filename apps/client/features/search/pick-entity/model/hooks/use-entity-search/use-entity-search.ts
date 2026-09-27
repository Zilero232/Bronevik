'use client';

import { useDebouncedSearch } from '@/entities/search/search';

import type { PickableKind, UseEntitySearchInput } from './use-entity-search.types';

import { isKind } from '../../../lib/search-kind';

export const useEntitySearch = <K extends PickableKind>({ kind, query }: UseEntitySearchInput<K>) => {
  const { data, ...state } = useDebouncedSearch({ query, select: (response) => response.results.filter(isKind(kind)) });

  return { results: data ?? [], ...state };
};
