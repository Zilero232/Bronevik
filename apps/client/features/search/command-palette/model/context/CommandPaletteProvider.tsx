'use client';

import { useBoolean } from '@siberiacancode/reactuse';

import type { CommandPaletteProviderProps } from './command-palette-context.types';

import { useCommandPaletteHotkey } from '../hooks';
import { CommandPaletteContext } from './command-palette-context';

export const CommandPaletteProvider = ({ children }: CommandPaletteProviderProps) => {
  const [isOpen, toggleOpen] = useBoolean(false);

  useCommandPaletteHotkey(() => toggleOpen());

  return <CommandPaletteContext value={{ isOpen, setOpen: toggleOpen }}>{children}</CommandPaletteContext>;
};
