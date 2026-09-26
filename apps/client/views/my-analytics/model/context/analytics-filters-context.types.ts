import type { AnalyticsPeriod } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type AnalyticsFiltersValue = {
  period: AnalyticsPeriod;
  account: number | undefined;
  setPeriod: (period: AnalyticsPeriod) => void;
  setAccount: (account: number | undefined) => void;
};

export type AnalyticsFiltersProviderProps = {
  children: ReactNode;
};
