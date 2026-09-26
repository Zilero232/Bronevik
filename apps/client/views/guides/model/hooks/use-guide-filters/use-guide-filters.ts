'use client';

import { useQueryStates } from 'nuqs';

import type { GuideSort } from '@/shared/api/guides';

import type { GuideKindFilter } from './use-guide-filters.types';

import { GUIDE_FILTER_PARSERS } from '../../../config';

export const useGuideFilters = () => {
  const [filters, setFilters] = useQueryStates(GUIDE_FILTER_PARSERS, { history: 'replace', scroll: false });

  return {
    filters,
    setKind: (kind: GuideKindFilter) => void setFilters({ kind: kind === 'all' ? null : kind, tank: null, map: null, page: null }),
    setTank: (tank: number | null) => void setFilters({ tank, page: null }),
    setMap: (map: string | null) => void setFilters({ map, page: null }),
    setSort: (sort: GuideSort) => void setFilters({ sort, page: null }),
    setPage: (page: number) => void setFilters({ page }),
    reset: () => void setFilters(null)
  };
};
