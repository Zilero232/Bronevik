import type { VehicleSummary } from '@bronevik/schemas';

export type TankCellProps = {
  vehicle: VehicleSummary;
  image?: 'contour' | 'small';
  className?: string;
};
