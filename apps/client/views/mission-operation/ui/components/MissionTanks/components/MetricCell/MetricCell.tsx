import { useFormatter } from 'next-intl';
import { isIncludedIn } from 'remeda';

import type { MetricCellProps } from './MetricCell.types';

import { METRIC_DIGITS, PERCENT_METRICS } from '../../../../../config';

import s from './MetricCell.module.scss';

export const MetricCell = ({ value, metric }: MetricCellProps) => {
  const format = useFormatter();

  if (value === null) {
    return <span className={s.root}>—</span>;
  }

  return (
    <span className={s.root}>
      {format.number(value, { maximumFractionDigits: metric ? METRIC_DIGITS[metric] : 0 })}
      {metric && isIncludedIn(metric, PERCENT_METRICS) && '%'}
    </span>
  );
};
