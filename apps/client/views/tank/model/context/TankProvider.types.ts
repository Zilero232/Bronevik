import type { TankDetail } from '@bronevik/schemas';
import type { ReactNode } from 'react';

export type TankProviderProps = {
  detail: TankDetail;
  children: ReactNode;
};
