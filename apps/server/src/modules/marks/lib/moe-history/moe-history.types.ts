import type { MoeHistoryPoint } from '@otmetki/schemas';

import type { MoeThreshold } from '../../../../../generated';

export type HistorySourceRow = MoeHistoryPoint &
  Pick<MoeThreshold, 'tankId'> & {
    source: string;
  };

export type HistorySeriesInput = {
  rows: readonly HistorySourceRow[];
  tankIds: readonly number[];
};
