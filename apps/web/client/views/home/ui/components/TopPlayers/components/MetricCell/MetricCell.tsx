import { useFormatter } from 'next-intl';

import { toneOfTier } from '@/shared/lib';

import type { MetricCellProps } from './MetricCell.types';

import s from './MetricCell.module.scss';

export const MetricCell = ({ entry }: MetricCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-tone={entry.tier ? toneOfTier(entry.tier) : undefined}>
      {format.number(entry.value, { maximumFractionDigits: 0 })}
    </span>
  );
};
