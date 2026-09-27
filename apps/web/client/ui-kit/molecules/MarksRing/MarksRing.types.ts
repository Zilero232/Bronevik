import type { ReactNode } from 'react';

export type MarksRingProps = {
  percent: number;
  label: string;
  size?: number;
  thickness?: number;
  children?: ReactNode;
  className?: string;
};
