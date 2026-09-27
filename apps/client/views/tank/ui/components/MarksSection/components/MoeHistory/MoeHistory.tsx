'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, LineChart, QueryState, Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../../../config';
import { useMoeChart } from '../../../../../model/hooks';

import s from './MoeHistory.module.scss';

export const MoeHistory = () => {
  const t = useTranslations('tank.marks');
  const { query, chart, isEmpty, formatValue } = useMoeChart();

  return (
    <div className={s.root}>
      <span className={s.label}>{t('historyTitle')}</span>
      <QueryState
        empty={<EmptyState title={t('historyEmpty')} />}
        isEmpty={() => isEmpty}
        query={query}
        skeleton={<Skeleton height={TANK_PAGE.chartHeight} shape='block' width='100%' />}
      >
        <LineChart
          hasTableToggle
          ariaLabel={t('historyTitle')}
          formatValue={formatValue}
          height={TANK_PAGE.chartHeight}
          labels={chart.labels}
          series={chart.series}
        />
      </QueryState>
    </div>
  );
};
