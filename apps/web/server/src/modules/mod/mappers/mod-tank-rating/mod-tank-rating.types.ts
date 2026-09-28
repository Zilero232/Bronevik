import type { ExpectedValues } from '@otmetki/ratings';

import type { TankRecordRow } from '../../queries';
import type { OwnTankRow, TankRatingRow, TankTotalsRow } from '../../selects';

export type ModTankRatingInput = {
  tankId: number;
  tank: OwnTankRow | undefined;
  rating: TankRatingRow | undefined;
  totals: TankTotalsRow | undefined;
  records: TankRecordRow | undefined;
  expected: ExpectedValues | undefined;
};

export type ModTankRecordsInput = Pick<ModTankRatingInput, 'records' | 'totals'>;
