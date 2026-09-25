'use client';

import { Group } from '@visx/group';
import { motion } from 'motion/react';

import { REVEAL_VIEWPORT } from '@/shared/lib';

import type { ChartCanvasProps } from '../../ChartKit.types';

import { CHART } from '../../ChartKit.constants';
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
    <motion.svg className={s.svg} height={height} initial='hidden' viewport={REVEAL_VIEWPORT} whileInView='visible' width={width}>
      <Group left={CHART.margin.left} top={CHART.margin.top}>
        <ChartAxes formatValue={formatValue} innerHeight={innerHeight} innerWidth={innerWidth} labels={labels} xScale={xScale} yScale={yScale} />
        {children}
        <rect className={s.hitbox} height={innerHeight} width={innerWidth} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove} />
      </Group>
    </motion.svg>
    {hover && <ChartTooltip formatValue={formatValue} labels={labels} series={series} state={hover} />}
  </>
);
