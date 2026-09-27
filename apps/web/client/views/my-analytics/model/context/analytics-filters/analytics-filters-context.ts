'use client';

import { createContext, use } from 'react';

import type { AnalyticsFiltersValue } from './analytics-filters-context.types';

export const AnalyticsFiltersContext = createContext<AnalyticsFiltersValue | null>(null);

export const useAnalyticsFilters = () => {
  const value = use(AnalyticsFiltersContext);

  if (!value) {
    throw new Error('useAnalyticsFilters must be used inside AnalyticsFiltersProvider');
  }

  return value;
};
