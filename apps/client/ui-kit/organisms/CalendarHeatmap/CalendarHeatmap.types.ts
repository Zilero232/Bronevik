import type { ReactNode } from 'react';

export type HeatmapDay = {
  date: string;
  value: number;
};

export type CalendarCell = {
  key: string;
  day: HeatmapDay | null;
};

export type CalendarWeek = CalendarCell[];

export type CalendarMonth = {
  index: number;
  date: string;
};

export type CalendarLayout = {
  weeks: CalendarWeek[];
  months: CalendarMonth[];
};

export type HeatLevelInput = {
  value: number;
  max: number;
  levels: number;
};

export type CalendarHeatmapLegend = {
  less: ReactNode;
  more: ReactNode;
};

export type CalendarHeatmapProps = {
  days: HeatmapDay[];
  levels?: number;
  ariaLabel: string;
  legend?: CalendarHeatmapLegend;
  className?: string;
  renderReadout?: (day: HeatmapDay | null) => ReactNode;
};
