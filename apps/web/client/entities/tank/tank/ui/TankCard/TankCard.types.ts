import type { TankServerStatsRow } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type TankCardProps = {
  row: TankServerStatsRow;
  action?: ReactNode;
  className?: string;
};
