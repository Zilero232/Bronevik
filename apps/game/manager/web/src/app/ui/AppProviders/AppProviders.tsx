import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createQueryClient } from '@/shared/api';

import type { AppProvidersProps } from './AppProviders.types';

import { IntlGate } from '../IntlGate';
import { NavigationProvider } from '../NavigationProvider';

export const AppProviders = ({ children }: AppProvidersProps) => {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlGate>
        <NavigationProvider>{children}</NavigationProvider>
      </IntlGate>
    </QueryClientProvider>
  );
};
