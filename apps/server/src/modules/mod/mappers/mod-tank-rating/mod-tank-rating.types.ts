import type { OwnTankRow, TankRatingRow, TankTotalsRow } from '../../selects';

export type ModTankRatingInput = {
  tankId: number;
  tank: OwnTankRow | undefined;
  rating: TankRatingRow | undefined;
  totals: TankTotalsRow | undefined;
};
