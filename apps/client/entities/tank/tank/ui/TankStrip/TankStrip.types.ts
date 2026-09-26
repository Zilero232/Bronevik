import type { VehicleSummary } from '@otmetki/schemas';

export type TankStripProps = {
  vehicles: readonly VehicleSummary[];
  label: string;
  more?: number;
  className?: string;
};
