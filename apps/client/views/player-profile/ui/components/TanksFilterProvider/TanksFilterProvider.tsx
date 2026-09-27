'use client';

import type { TanksFilterProviderProps } from './TanksFilterProvider.types';

import { TanksFilterContext } from '../../../model/context';
import { useTanksFilterState } from '../../../model/hooks';

export const TanksFilterProvider = ({ children }: TanksFilterProviderProps) => {
  const value = useTanksFilterState();

  return <TanksFilterContext value={value}>{children}</TanksFilterContext>;
};
