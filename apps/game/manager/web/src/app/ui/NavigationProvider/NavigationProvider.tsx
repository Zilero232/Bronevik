import { NavigationContext } from '@/shared/lib';

import type { NavigationProviderProps } from './NavigationProvider.types';

import { useNavigationState } from '../../model/hooks';

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const value = useNavigationState();

  return <NavigationContext value={value}>{children}</NavigationContext>;
};
