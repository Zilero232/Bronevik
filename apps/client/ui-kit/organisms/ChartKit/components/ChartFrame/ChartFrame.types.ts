import type { ReactNode } from 'react';

export type ChartFrameProps = {
  height: number;
  ariaLabel?: string;
  className?: string;
  children: (width: number) => ReactNode;
};
