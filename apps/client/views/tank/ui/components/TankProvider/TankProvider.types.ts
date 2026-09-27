import type { ReactNode } from 'react';

import type { TankContextValue } from '../../../model/context';

export type TankProviderProps = Pick<TankContextValue, 'detail'> & {
  children: ReactNode;
};
