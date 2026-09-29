'use client';

import { createContext, use } from 'react';

import type { ArmorAttackContextValue } from './armor-attack-context.types';

export const ArmorAttackContext = createContext<ArmorAttackContextValue | null>(null);

export const useArmorAttack = () => {
  const context = use(ArmorAttackContext);

  if (!context) {
    throw new Error('useArmorAttack must be used inside ArmorAttackProvider');
  }

  return context;
};
