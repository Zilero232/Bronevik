import type { TimeSeriesQuery } from '@otmetki/schemas';

export type HistorySeriesSqlInput = {
  accountId: bigint;
  granularity: TimeSeriesQuery['granularity'];
  from: Date;
  to: Date;
};
