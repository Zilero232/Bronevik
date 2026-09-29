import type { ReactNode } from 'react';

import type { TANK_SECTIONS } from '../../../config';

export type TankSectionProps = {
  id: (typeof TANK_SECTIONS)[keyof typeof TANK_SECTIONS];
  title: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};
