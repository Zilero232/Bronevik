'use client';

import { useQueryStates } from 'nuqs';

import type { DirectoryPlatformFilter, DirectoryToggle } from '../../../lib/directory-query';

import { DIRECTORY_FILTER_PARSERS } from '../../../config';
import { activeToggles, hasDirectoryFilters } from '../../../lib/directory-query';

export const useDirectoryFilters = () => {
  const [filters, setFilters] = useQueryStates(DIRECTORY_FILTER_PARSERS, { history: 'replace', scroll: false });

  const platform: DirectoryPlatformFilter = filters.platform ?? 'all';

  return {
    filters,
    toggles: activeToggles(filters),
    platform,
    hasFilters: hasDirectoryFilters(filters),
    setToggles: (values: DirectoryToggle[]) =>
      void setFilters({ live: values.includes('live') ? true : null, settings: values.includes('settings') ? true : null }),
    setPlatform: (value: DirectoryPlatformFilter) => void setFilters({ platform: value === 'all' ? null : value }),
    reset: () => void setFilters(null)
  };
};
