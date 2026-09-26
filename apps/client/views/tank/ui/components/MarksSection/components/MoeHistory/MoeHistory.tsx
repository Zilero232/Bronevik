'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, LineChart, Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../../../config';
import { useMoeChart } from '../../../../../model/hooks';

import s from './MoeHistory.module.scss';

export const MoeHistory = () => {
  const t = useTranslations('tank.marks');
  const { chart, isEmpty, isPending, isError, refetch, formatValue } = useMoeChart();

  return (
    <div className={s.root}>
      <span className={s.label}>{t('historyTitle')}</span>
      {match({ isPending, isError, isEmpty })
        .with({ isPending: true }, () => <Skeleton height={TANK_PAGE.chartHeight} shape='block' width='100%' />)
        .with({ isError: true }, () => <ErrorState onRetry={() => void refetch()} />)
        .with({ isEmpty: true }, () => <EmptyState title={t('historyEmpty')} />)
        .otherwise(() => (
          <LineChart
            ariaLabel={t('historyTitle')}
            formatValue={formatValue}
            height={TANK_PAGE.chartHeight}
            labels={chart.labels}
            series={chart.series}
          />
        ))}
    </div>
  );
};
