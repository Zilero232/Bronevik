import type { MoeHistoryPoint } from '@otmetki/schemas';

import type { TankThreshold } from '../../../../../generated';

export type HistorySourceRow = MoeHistoryPoint &
  Pick<TankThreshold, 'tankId'> & {
    source: string;
  };

export type HistorySeriesInput = {
  rows: readonly HistorySourceRow[];
  tankIds: readonly number[];
};
