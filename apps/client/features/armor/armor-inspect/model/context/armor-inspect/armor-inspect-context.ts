'use client';

import { createContext, use } from 'react';

import type { ArmorInspectContextValue } from './armor-inspect-context.types';

export const ArmorInspectContext = createContext<ArmorInspectContextValue | null>(null);

export const useArmorInspect = () => {
  const context = use(ArmorInspectContext);

  if (!context) {
    throw new Error('useArmorInspect must be used inside ArmorInspectProvider');
  }

  return context;
};
