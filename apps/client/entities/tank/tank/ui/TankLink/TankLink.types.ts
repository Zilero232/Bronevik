import type { VehicleSummary } from '@otmetki/schemas';

export type TankLinkProps = {
  vehicle: VehicleSummary;
  image?: 'contour' | 'small';
  className?: string;
};
