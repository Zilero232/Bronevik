import type { ReactNode } from 'react';

import type { ChartBaseProps, ChartPlotProps } from '../../ChartKit.types';

export type ChartFrameProps = Omit<ChartBaseProps, 'yDomain'> & {
  children: (plot: ChartPlotProps) => ReactNode;
};
