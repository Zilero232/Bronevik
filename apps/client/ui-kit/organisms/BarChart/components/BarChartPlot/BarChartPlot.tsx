'use client';

import { scaleBand } from '@visx/scale';

import { bandLayout, clampIndex, useChartHover } from '@/shared/lib';

import type { BarChartPlotProps } from '../../BarChart.types';

import { ChartCanvas } from '../../../ChartKit';

import s from '../../../ChartKit/ChartKit.module.scss';

export const BarChartPlot = ({ labels, series, width, height, yDomain, formatValue }: BarChartPlotProps) => {
  const layout = bandLayout({ width, height, labels, series, yDomain });
  const { xScale, yScale } = layout;
  const inner = scaleBand<string>({ domain: series.map((item) => item.id), range: [0, xScale.bandwidth()], padding: 0.12 });
  const pointer = useChartHover({
    count: labels.length,
    toIndex: (x) => clampIndex({ value: (x - xScale.step() * xScale.paddingOuter()) / xScale.step() - 0.5, count: labels.length }),
    toPosition: (index) => ({
      left: (xScale(labels[index]) ?? 0) + xScale.bandwidth() / 2,
      top: yScale(Math.max(...series.map((item) => item.values[index] ?? 0)))
    })
  });

  return (
    <ChartCanvas {...layout} {...pointer} formatValue={formatValue} height={height} labels={labels} series={series} width={width}>
      {series.map((item) => (
        <g key={item.id} className={s.series} data-tone={item.tone ?? 'accent'}>
          {labels.map((label, index) => {
            const top = yScale(Math.max(item.values[index] ?? 0, 0));

            return (
              <rect
                key={label}
                className={s.bar}
                data-active={pointer.hover?.index === index}
                height={Math.max(yScale(0) - top, 0)}
                rx={1}
                width={inner.bandwidth()}
                x={(xScale(label) ?? 0) + (inner(item.id) ?? 0)}
                y={top}
              />
            );
          })}
        </g>
      ))}
    </ChartCanvas>
  );
};
