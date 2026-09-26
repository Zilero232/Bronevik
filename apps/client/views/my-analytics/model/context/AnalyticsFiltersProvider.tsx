'use client';

import type { AnalyticsPeriod } from '@otmetki/schemas';

import { useState } from 'react';

import type { AnalyticsFiltersProviderProps } from './analytics-filters-context.types';

import { ANALYTICS_VIEW } from '../../config';
import { AnalyticsFiltersContext } from './analytics-filters-context';

export const AnalyticsFiltersProvider = ({ children }: AnalyticsFiltersProviderProps) => {
  const [period, setPeriod] = useState<AnalyticsPeriod>(ANALYTICS_VIEW.defaultPeriod);
  const [account, setAccount] = useState<number | undefined>(undefined);

  return <AnalyticsFiltersContext value={{ period, account, setPeriod, setAccount }}>{children}</AnalyticsFiltersContext>;
};
