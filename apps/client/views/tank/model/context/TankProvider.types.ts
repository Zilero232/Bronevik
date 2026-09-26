import type { TankDetail } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type TankProviderProps = {
  detail: TankDetail;
  children: ReactNode;
};
