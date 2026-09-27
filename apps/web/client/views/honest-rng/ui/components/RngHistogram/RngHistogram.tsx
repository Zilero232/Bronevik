import { BarChart, Card, CardHeader } from '@/ui-kit';

import type { RngHistogramProps } from './RngHistogram.types';

import { HONEST_RNG_VIEW } from '../../../config';

import s from './RngHistogram.module.scss';

export const RngHistogram = ({ title, meta, labels, series, formatValue }: RngHistogramProps) => (
  <Card padding='none'>
    <CardHeader meta={meta} title={title} />
    <div className={s.chart}>
      <BarChart ariaLabel={title} formatValue={formatValue} height={HONEST_RNG_VIEW.chartHeight} labels={labels} series={series} />
    </div>
  </Card>
);
