'use client';

import type { ArmorAttackProviderProps } from './ArmorAttackProvider.types';

import { ArmorAttackContext } from '../../model/context';
import { useArmorAttackState } from '../../model/hooks';

export const ArmorAttackProvider = ({ modules, children }: ArmorAttackProviderProps) => {
  const value = useArmorAttackState(modules);

  return <ArmorAttackContext value={value}>{children}</ArmorAttackContext>;
};
