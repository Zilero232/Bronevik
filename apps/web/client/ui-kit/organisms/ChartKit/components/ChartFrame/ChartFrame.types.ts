import type { ReactNode } from 'react';

import type { ChartBaseProps } from '../../ChartKit.types';

export type ChartFrameProps = Pick<ChartBaseProps, 'ariaLabel' | 'className' | 'hasTableToggle' | 'labels' | 'series'> & {
  height: number;
  formatValue: (value: number) => string;
  children: (width: number) => ReactNode;
};
