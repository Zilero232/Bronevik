'use client';

import { createContext, use } from 'react';

import type { BuildContextValue } from './build-context.types';

export const BuildContext = createContext<BuildContextValue | null>(null);

export const useBuildContext = () => {
  const value = use(BuildContext);

  if (!value) {
    throw new Error('useBuildContext must be used inside BuildProvider');
  }

  return value;
};
