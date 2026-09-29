import type { ReactNode } from 'react';

export type ActiveFilter = {
  id: string;
  label: string;
  onRemove: () => void;
};

export type FilterBarProps = {
  label?: string;
  children: ReactNode;
  active?: readonly ActiveFilter[];
  activeCount?: number;
  primary?: ReactNode;
  more?: ReactNode;
  moreLabel?: string;
  moreCount?: number;
  actions?: ReactNode;
  variant?: 'bare' | 'panel';
  className?: string;
  onReset?: () => void;
};
