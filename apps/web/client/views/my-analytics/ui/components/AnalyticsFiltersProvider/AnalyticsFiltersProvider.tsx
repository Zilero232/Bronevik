'use client';

import type { AnalyticsFiltersProviderProps } from './AnalyticsFiltersProvider.types';

import { AnalyticsFiltersContext } from '../../../model/context';
import { useAnalyticsFiltersState } from '../../../model/hooks';

export const AnalyticsFiltersProvider = ({ children }: AnalyticsFiltersProviderProps) => {
  const value = useAnalyticsFiltersState();

  return <AnalyticsFiltersContext value={value}>{children}</AnalyticsFiltersContext>;
};
