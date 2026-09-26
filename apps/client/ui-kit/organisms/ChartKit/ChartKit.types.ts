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
  formatValue?: (value: number) => string;
};

export type ChartAxesProps = {
  xScale: BandScale | LinearScale;
  yScale: LinearScale;
  labels: string[];
  innerWidth: number;
  innerHeight: number;
  formatValue: (value: number) => string;
};

export type ChartTooltipProps = {
  state: ChartHoverState;
  labels: string[];
  series: ChartSeries[];
  formatValue: (value: number) => string;
};

export type ChartCanvasProps = ChartAxesProps & {
  width: number;
  height: number;
  series: ChartSeries[];
  hover: ChartHoverState | null;
  children: ReactNode;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerLeave: () => void;
};
