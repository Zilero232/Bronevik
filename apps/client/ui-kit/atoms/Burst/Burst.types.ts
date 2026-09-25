import type { ReactNode } from 'react';

export type BurstProps = {
  trigger: number;
  count?: number;
  radius?: number;
  className?: string;
  children?: ReactNode;
};
