import type { ReactNode } from 'react';

type FactGridItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

export type FactGridProps = {
  items: readonly FactGridItem[];
};
