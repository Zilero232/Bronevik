'use client';

import type { CommandPaletteProviderProps } from './CommandPaletteProvider.types';

import { CommandPaletteContext } from '../../model/context';
import { useCommandPaletteState } from '../../model/hooks';

export const CommandPaletteProvider = ({ children }: CommandPaletteProviderProps) => {
  const value = useCommandPaletteState();

  return <CommandPaletteContext value={value}>{children}</CommandPaletteContext>;
};
