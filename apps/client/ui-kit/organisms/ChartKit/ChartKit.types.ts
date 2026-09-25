import type { scaleBand, scaleLinear } from '@visx/scale';
import type { PointerEvent, ReactNode } from 'react';

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

export type ChartLayoutInput = {
  width: number;
  height: number;
  labels: string[];
  series: ChartSeries[];
  yDomain?: [number, number];
  includeZero?: boolean;
};

export type ChartAxesProps = {
  xScale: BandScale | LinearScale;
  yScale: LinearScale;
  labels: string[];
  innerWidth: number;
  innerHeight: number;
  formatValue: (value: number) => string;
};

export type ChartTooltipState = {
  index: number;
  left: number;
  top: number;
};

export type ChartTooltipProps = {
  state: ChartTooltipState;
  labels: string[];
  series: ChartSeries[];
  formatValue: (value: number) => string;
};

export type ClampIndexInput = {
  value: number;
  count: number;
};

export type UseChartHoverInput = {
  count: number;
  toIndex: (x: number) => number;
  toPosition: (index: number) => { left: number; top: number };
};

export type ChartCanvasProps = ChartAxesProps & {
  width: number;
  height: number;
  series: ChartSeries[];
  hover: ChartTooltipState | null;
  children: ReactNode;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerLeave: () => void;
};
