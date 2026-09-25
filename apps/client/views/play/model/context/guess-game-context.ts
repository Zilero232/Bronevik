'use client';

import { createContext, use } from 'react';

import type { GuessGame } from './guess-game.types';

export const GuessGameContext = createContext<GuessGame | null>(null);

export const useGuessGame = () => {
  const context = use(GuessGameContext);

  if (!context) {
    throw new Error('useGuessGame must be used inside GuessGameContext');
  }

  return context;
};
