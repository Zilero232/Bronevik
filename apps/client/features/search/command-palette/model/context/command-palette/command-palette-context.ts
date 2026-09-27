'use client';

import { createContext, use } from 'react';

import type { CommandPaletteContextValue } from './command-palette-context.types';

export const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export const useCommandPalette = () => {
  const context = use(CommandPaletteContext);

  if (!context) {
    throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
  }

  return context;
};
