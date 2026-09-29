'use client';

import { createContext, use } from 'react';

import type { GuessMapGame } from './guess-map.types';

export const GuessMapContext = createContext<GuessMapGame | null>(null);

export const useGuessMap = () => {
  const context = use(GuessMapContext);

  if (!context) {
    throw new Error('useGuessMap must be used inside GuessMapContext');
  }

  return context;
};
