import type { ReactNode } from 'react';

export type FactGridItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

export type FactGridProps = {
  items: readonly FactGridItem[];
};
