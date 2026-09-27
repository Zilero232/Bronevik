import { createContext, use } from 'react';

import type { NavigationValue } from './navigation.types';

export const NavigationContext = createContext<NavigationValue | null>(null);

export const useNavigation = (): NavigationValue => {
  const value = use(NavigationContext);

  if (!value) {
    throw new Error('useNavigation must be used inside NavigationProvider');
  }

  return value;
};
