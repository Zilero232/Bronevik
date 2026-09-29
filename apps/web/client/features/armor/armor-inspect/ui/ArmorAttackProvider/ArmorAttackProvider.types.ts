import type { ArmorModulesData } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type ArmorAttackProviderProps = {
  modules: ArmorModulesData;
  children: ReactNode;
};
