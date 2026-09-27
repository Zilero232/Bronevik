import type { AnalyticsPeriod } from '@otmetki/schemas';

export type AnalyticsFiltersValue = {
  period: AnalyticsPeriod;
  account: number | undefined;
  setPeriod: (period: AnalyticsPeriod) => void;
  setAccount: (account: number | undefined) => void;
};
