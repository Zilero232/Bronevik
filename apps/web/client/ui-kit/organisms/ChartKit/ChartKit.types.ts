import type { scaleBand, scaleLinear } from '@visx/scale';
import type { PointerEvent, ReactNode } from 'react';

import type { ChartHoverState } from '@/shared/lib';

import type { ProgressTone } from '../../atoms';

type LinearScale = ReturnType<typeof scaleLinear<number>>;

type BandScale = ReturnType<typeof scaleBand<string>>;

export type ChartSeries = {
  id: string;
  label: string;
  values: number[];
  tone?: ProgressTone;
};

export type ChartBaseProps = {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  yDomain?: [number, number];
  ariaLabel?: string;
  className?: string;
  hasTableToggle?: boolean;
  formatValue?: (value: number) => string;
};

type ChartValueFormat = Required<Pick<ChartBaseProps, 'formatValue'>>;

export type ChartPlotProps = Pick<ChartBaseProps, 'labels' | 'series'> &
  ChartValueFormat & {
    width: number;
    height: number;
  };

export type ChartDataTableProps = Pick<ChartBaseProps, 'labels' | 'series'> &
  ChartValueFormat & {
    id: string;
    caption?: string;
    isVisible: boolean;
  };

export type ChartAxesProps = Pick<ChartBaseProps, 'labels'> &
  ChartValueFormat & {
    xScale: BandScale | LinearScale;
    yScale: LinearScale;
    innerWidth: number;
    innerHeight: number;
  };

export type ChartTooltipProps = Pick<ChartBaseProps, 'labels' | 'series'> &
  ChartValueFormat & {
    state: ChartHoverState;
  };

export type ChartCanvasProps = ChartAxesProps &
  ChartPlotProps & {
    hover: ChartHoverState | null;
    children: ReactNode;
    onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
    onPointerLeave: (event: PointerEvent<SVGRectElement>) => void;
  };
