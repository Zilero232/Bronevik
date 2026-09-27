'use client';

import type { ArmorInspectProviderProps } from './ArmorInspectProvider.types';

import { ArmorInspectContext } from '../../model/context';
import { useArmorInspectState } from '../../model/hooks';

export const ArmorInspectProvider = ({ modules, children }: ArmorInspectProviderProps) => {
  const value = useArmorInspectState(modules);

  return <ArmorInspectContext value={value}>{children}</ArmorInspectContext>;
};
