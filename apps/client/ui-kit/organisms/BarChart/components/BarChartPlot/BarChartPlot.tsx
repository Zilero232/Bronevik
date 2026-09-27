'use client';

import { seriesTone, useBarChartLayout } from '@/shared/lib';

import type { BarChartPlotProps } from '../../BarChart.types';

import { ChartCanvas } from '../../../ChartKit';

import s from '../../../ChartKit/ChartKit.module.scss';

export const BarChartPlot = ({ labels, series, width, height, yDomain, formatValue }: BarChartPlotProps) => {
  const { layout, pointer, inner } = useBarChartLayout({ width, height, labels, series, yDomain });

  const { xScale, yScale } = layout;

  return (
    <ChartCanvas {...layout} {...pointer} formatValue={formatValue} height={height} labels={labels} series={series} width={width}>
      {series.map((item, seriesIndex) => (
        <g key={item.id} className={s.series} data-tone={seriesTone({ tone: item.tone, index: seriesIndex })}>
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
