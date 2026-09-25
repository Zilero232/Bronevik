import type { VehicleSummary } from '@bronevik/schemas';

import type { MoeTargetValue } from '../../../config';

export type MoeResultsProps = {
  vehicle: VehicleSummary | null;
  percent: number;
  damage: number;
  target: MoeTargetValue;
};

export type MoeValues = {
  percent: number;
  damage: number | null;
  target: MoeTargetValue;
};
