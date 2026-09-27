'use client';

import { curveMonotoneX } from '@visx/curve';
import { AreaClosed, LinePath } from '@visx/shape';

import { clampIndex, linearLayout, seriesTone, useChartHover } from '@/shared/lib';

import type { LineChartPlotProps } from '../../LineChart.types';

import { ChartCanvas } from '../../../ChartKit';

import s from '../../../ChartKit/ChartKit.module.scss';

export const LineChartPlot = ({ labels, series, width, height, yDomain, withArea = false, formatValue }: LineChartPlotProps) => {
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
      {series.map((item, seriesIndex) => {
        const points = item.values.map((value, index) => ({ index, value }));

        return (
          <g key={item.id} className={s.series} data-tone={seriesTone({ tone: item.tone, index: seriesIndex })}>
            {withArea && (
              <AreaClosed curve={curveMonotoneX} data={points} x={(point) => xScale(point.index)} y={(point) => yScale(point.value)} yScale={yScale}>
                {({ path }) => <path className={s.area} d={path(points) ?? ''} />}
              </AreaClosed>
            )}
            <LinePath curve={curveMonotoneX} data={points} x={(point) => xScale(point.index)} y={(point) => yScale(point.value)}>
              {({ path }) => <path className={s.line} d={path(points) ?? ''} />}
            </LinePath>
            {hover && <circle className={s.dot} cx={xScale(hover.index)} cy={yScale(item.values[hover.index] ?? 0)} r={3} />}
          </g>
        );
      })}
      {hover && <line className={s.crosshair} x1={xScale(hover.index)} x2={xScale(hover.index)} y1={0} y2={innerHeight} />}
    </ChartCanvas>
  );
};
