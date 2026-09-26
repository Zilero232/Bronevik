import type { ReactNode } from 'react';

import type { CalendarDay } from '@/shared/lib';

export type HeatmapDay = CalendarDay;

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
