import type { AnalyticsPeriod } from '@otmetki/schemas';

export type PeriodStartInput = {
  period: AnalyticsPeriod;
  now: Date;
};
