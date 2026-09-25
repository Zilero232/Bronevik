'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { LineChart } from '@/ui-kit';

import type { ProjectionChartProps } from '../../MoeProjection.types';

import { MOE_PROJECTION } from '../../../../../config';

export const ProjectionChart = ({ curve, targetPercent }: ProjectionChartProps) => {
  const t = useTranslations('marks.projection');
  const format = useFormatter();

  const percents = curve.map(({ percent }) => percent);
  const floor = Math.max(0, Math.floor(Math.min(...percents, targetPercent) - 3));

  return (
    <LineChart
      withArea
      series={[
        { id: 'projected', label: t('curveSeries'), values: percents, tone: 'accent' },
        { id: 'target', label: t('targetSeries', { percent: targetPercent }), values: curve.map(() => targetPercent), tone: 'steel' }
      ]}
      ariaLabel={t('curveAria')}
      formatValue={(value) => `${format.number(value, { maximumFractionDigits: 1 })}%`}
      height={MOE_PROJECTION.chartHeight}
      labels={curve.map(({ battle }) => t('battleLabel', { battle }))}
      yDomain={[floor, 100]}
    />
  );
};
