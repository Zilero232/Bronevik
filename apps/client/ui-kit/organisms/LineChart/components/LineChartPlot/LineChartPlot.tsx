'use client';

import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AreaClosed, LinePath } from '@visx/shape';
import { motion } from 'motion/react';

import { DRAW_IN, FADE, useSvgId } from '@/shared/lib';

import type { LineChartPlotProps } from '../../LineChart.types';

import { ChartCanvas, clampIndex, linearLayout, useChartHover } from '../../../ChartKit';

import s from '../../../ChartKit/ChartKit.module.scss';

export const LineChartPlot = ({ labels, series, width, height, yDomain, withArea = false, formatValue }: LineChartPlotProps) => {
  const gradientId = useSvgId('line');
  const layout = linearLayout({ width, height, labels, series, yDomain });
  const { innerHeight, xScale, yScale } = layout;
  const pointer = useChartHover({
    count: labels.length,
    toIndex: (x) => clampIndex({ value: xScale.invert(x), count: labels.length }),
    toPosition: (index) => ({ left: xScale(index), top: yScale(series[0]?.values[index] ?? 0) })
  });

  const { hover } = pointer;

  return (
    <ChartCanvas {...layout} {...pointer} formatValue={formatValue} height={height} labels={labels} series={series} width={width}>
      {series.map((item) => {
        const points = item.values.map((value, index) => ({ index, value }));
        const fillId = `${gradientId}-${item.id}`;

        return (
          <g key={item.id} className={s.series} data-tone={item.tone ?? 'accent'}>
            <LinearGradient className={s.gradient} fromOpacity={0.32} id={fillId} toOpacity={0} />
            {withArea && (
              <AreaClosed curve={curveMonotoneX} data={points} x={(point) => xScale(point.index)} y={(point) => yScale(point.value)} yScale={yScale}>
                {({ path }) => <motion.path d={path(points) ?? ''} fill={`url(#${fillId})`} variants={FADE} />}
              </AreaClosed>
            )}
            <LinePath curve={curveMonotoneX} data={points} x={(point) => xScale(point.index)} y={(point) => yScale(point.value)}>
              {({ path }) => <motion.path className={s.line} d={path(points) ?? ''} variants={DRAW_IN} />}
            </LinePath>
            {hover && <circle className={s.dot} cx={xScale(hover.index)} cy={yScale(item.values[hover.index] ?? 0)} r={4} />}
          </g>
        );
      })}
      {hover && <line className={s.crosshair} x1={xScale(hover.index)} x2={xScale(hover.index)} y1={0} y2={innerHeight} />}
    </ChartCanvas>
  );
};
