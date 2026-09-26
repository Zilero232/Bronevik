import type { ReactNode } from 'react';

export type PaletteItemProps = {
  value: string;
  icon?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  onSelect: () => void;
};
