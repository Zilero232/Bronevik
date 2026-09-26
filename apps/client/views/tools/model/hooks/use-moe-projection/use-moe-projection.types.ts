import type { VehicleSummary } from '@bronevik/schemas';

import type { MoeTargetValue } from '../../../config';

export type UseMoeProjectionInput = {
  vehicle: VehicleSummary | null;
  percent: number;
  damage: number;
  target: MoeTargetValue;
};
