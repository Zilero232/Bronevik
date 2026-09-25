import type { VehicleSummary } from '@bronevik/schemas';

import type { TARGET_MARKS } from '../../../config';

export type TargetMarks = (typeof TARGET_MARKS)[number]['value'];

export type MoeProjectionInputs = {
  vehicle: VehicleSummary | null;
  percent: number;
  damage: number | null;
  marks: TargetMarks;
};
