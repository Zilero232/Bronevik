'use client';

import type { PointerEvent } from 'react';

import { localPoint } from '@visx/event';
import { useState } from 'react';

import type { ChartHoverState, UseChartHoverInput } from './use-chart-hover.types';

import { CHART } from '../chart-scale';

export const useChartHover = ({ count, toIndex, toPosition }: UseChartHoverInput) => {
  const [hover, setHover] = useState<ChartHoverState | null>(null);

  const onPointerMove = (event: PointerEvent<SVGRectElement>) => {
    const point = localPoint(event);

    if (!point || count === 0) {
      return;
    }

    const index = toIndex(point.x - CHART.margin.left);
    const { left, top } = toPosition(index);

    setHover({ index, left: left + CHART.margin.left, top: top + CHART.margin.top });
  };

  const onPointerLeave = (event: PointerEvent<SVGRectElement>) => {
    if (event.pointerType !== 'touch') {
      setHover(null);
    }
  };

  return { hover, onPointerMove, onPointerLeave };
};
