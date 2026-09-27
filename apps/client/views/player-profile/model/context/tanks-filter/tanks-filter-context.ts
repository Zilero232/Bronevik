'use client';

import { createContext, use } from 'react';

import type { TanksFilterControls } from '../../hooks';

export const TanksFilterContext = createContext<TanksFilterControls | null>(null);

export const useTanksFilterContext = () => {
  const value = use(TanksFilterContext);

  if (!value) {
    throw new Error('useTanksFilterContext must be used inside TanksFilterProvider');
  }

  return value;
};
