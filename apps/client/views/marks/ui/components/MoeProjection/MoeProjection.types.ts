import type { MoeThreshold, VehicleSummary } from '@bronevik/schemas';

import type { MoeCurvePoint } from '../../../lib/moe-curve';
import type { MoeProjectionInputs, TargetMarks } from '../../../model/hooks';

export type ProjectionFormProps = {
  inputs: MoeProjectionInputs;
  threshold: MoeThreshold | null;
  onVehicleChange: (vehicle: VehicleSummary | null) => void;
  onPercentChange: (percent: number) => void;
  onDamageChange: (damage: number | null) => void;
  onMarksChange: (marks: TargetMarks) => void;
};

export type ProjectionResultProps = {
  battles: number | null;
  hasResult: boolean;
  hasVehicle: boolean;
  isLoading: boolean;
  marks: TargetMarks;
  targetDamage: number | null;
};

export type ProjectionChartProps = {
  curve: MoeCurvePoint[];
  targetPercent: number;
};
