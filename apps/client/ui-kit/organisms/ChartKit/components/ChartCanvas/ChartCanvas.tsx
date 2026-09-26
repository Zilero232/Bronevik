'use client';

import { Group } from '@visx/group';

import { CHART } from '@/shared/lib';

import type { ChartCanvasProps } from '../../ChartKit.types';

import { ChartAxes } from '../ChartAxes';
import { ChartTooltip } from '../ChartTooltip';

import s from '../../ChartKit.module.scss';

export const ChartCanvas = ({
  width,
  height,
  innerWidth,
  innerHeight,
  xScale,
  yScale,
  labels,
  series,
  hover,
  children,
  formatValue,
  onPointerMove,
  onPointerLeave
}: ChartCanvasProps) => (
  <>
    <svg className={s.svg} height={height} width={width}>
      <Group left={CHART.margin.left} top={CHART.margin.top}>
        <ChartAxes formatValue={formatValue} innerHeight={innerHeight} innerWidth={innerWidth} labels={labels} xScale={xScale} yScale={yScale} />
        {children}
        <rect className={s.hitbox} height={innerHeight} width={innerWidth} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove} />
      </Group>
    </svg>
    {hover && <ChartTooltip formatValue={formatValue} labels={labels} series={series} state={hover} />}
  </>
);
