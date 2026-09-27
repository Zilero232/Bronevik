'use client';

import { useBoolean } from '@siberiacancode/reactuse';

import type { CommandPaletteContextValue } from '../../context';

import { useCommandPaletteHotkey } from '../use-command-palette-hotkey';

export const useCommandPaletteState = (): CommandPaletteContextValue => {
  const [isOpen, toggleOpen] = useBoolean(false);

  useCommandPaletteHotkey(() => toggleOpen());

  return { isOpen, setOpen: toggleOpen };
};
