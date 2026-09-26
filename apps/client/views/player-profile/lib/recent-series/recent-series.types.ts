import type { TimeSeries } from '@otmetki/schemas';

export type RecentSeriesInput = {
  series?: TimeSeries;
  count: number;
};
