import type { VehicleSummary } from '@otmetki/schemas';

export type ColumnHeadProps = {
  vehicle: VehicleSummary;
  onRemove: () => void;
};
