import type { ReactNode } from 'react';

export type LegendTone = 'danger' | 'neutral' | 'success' | 'warning';

type LegendItem = {
  key: string;
  tone: LegendTone;
  label: ReactNode;
};

export type LegendProps = {
  items: readonly LegendItem[];
  className?: string;
  'aria-label': string;
};
