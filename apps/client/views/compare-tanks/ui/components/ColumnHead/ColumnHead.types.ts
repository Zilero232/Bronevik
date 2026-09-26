import type { VehicleSummary } from '@bronevik/schemas';

export type ColumnHeadProps = {
  vehicle: VehicleSummary;
  onRemove: () => void;
};
