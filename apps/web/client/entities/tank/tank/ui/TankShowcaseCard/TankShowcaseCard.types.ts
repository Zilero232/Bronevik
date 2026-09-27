import type { VehicleSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type TankShowcaseFigure = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  delta?: number | null;
  isDeltaLowerBetter?: boolean;
};

export type TankShowcaseCardProps = {
  vehicle: VehicleSummary;
  href?: string;
  layout?: 'column' | 'row';
  meta?: ReactNode;
  figures?: readonly TankShowcaseFigure[];
  footer?: ReactNode;
  ribbon?: ReactNode;
  isPriority?: boolean;
  className?: string;
};
