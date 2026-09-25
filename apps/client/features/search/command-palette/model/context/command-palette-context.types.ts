import type { ReactNode } from 'react';

export type CommandPaletteContextValue = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export type CommandPaletteProviderProps = {
  children: ReactNode;
};
