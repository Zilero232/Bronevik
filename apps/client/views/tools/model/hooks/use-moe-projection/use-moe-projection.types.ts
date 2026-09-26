import type { VehicleSummary } from '@otmetki/schemas';

import type { MoeTargetValue } from '../../../config';

export type UseMoeProjectionInput = {
  vehicle: VehicleSummary | null;
  percent: number;
  damage: number;
  target: MoeTargetValue;
};
