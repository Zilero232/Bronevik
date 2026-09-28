'use client';

import { useQueryStates } from 'nuqs';

import { CATALOG_SEARCH_PARSERS } from '../../../config';

export const useCatalogSearch = () => {
  const [{ q }, setSearch] = useQueryStates(CATALOG_SEARCH_PARSERS, { history: 'replace', scroll: false });

  return {
    search: q,
    onSearchChange: (next: string) => void setSearch({ q: next.length > 0 ? next : null }),
    resetSearch: () => void setSearch(null)
  };
};
