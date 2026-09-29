'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, LineChart, QueryState, Skeleton } from '@/ui-kit';

import type { MoeHistoryChartProps } from './MoeHistoryChart.types';

import { MOE_LIST } from '../../../../../config';
import { useMoeHistoryChart } from '../../../../../model/hooks';

export const MoeHistoryChart = ({ tankId }: MoeHistoryChartProps) => {
  const t = useTranslations('marks.drawer');
  const { query, series, isEmpty, labels, formatValue } = useMoeHistoryChart(tankId);

  return (
    <QueryState
      empty={<EmptyState description={t('noHistoryHint')} title={t('noHistory')} />}
      isEmpty={() => isEmpty}
      query={query}
      skeleton={<Skeleton height={MOE_LIST.historyChartHeight} width='100%' />}
    >
      <LineChart ariaLabel={t('historyAria')} formatValue={formatValue} height={MOE_LIST.historyChartHeight} labels={labels} series={series} />
    </QueryState>
  );
};
