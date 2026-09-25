'use client';

import { createContext, use } from 'react';

import type { TankContextValue } from './tank-context.types';

export const TankContext = createContext<TankContextValue | null>(null);

export const useTank = () => {
  const context = use(TankContext);

  if (!context) {
    throw new Error('useTank must be used inside TankProvider');
  }

  return context;
};
