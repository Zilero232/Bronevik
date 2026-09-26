import type { VehicleSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type TankShowcaseFigure = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

export type TankShowcaseCardProps = {
  vehicle: VehicleSummary;
  href?: string;
  figures?: readonly TankShowcaseFigure[];
  footer?: ReactNode;
  ribbon?: ReactNode;
  className?: string;
};
