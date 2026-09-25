'use client';

import { LineChartIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import type { ChartSeries } from '@/ui-kit';

import { EmptyState, LineChart, Skeleton } from '@/ui-kit';

import type { MoeHistoryChartProps } from '../../MoeDrawer.types';

import { MOE_LIST } from '../../../../../config';
import { historySeries } from '../../../../../lib/moe-history';
import { useMoeHistory } from '../../../../../model/hooks';

export const MoeHistoryChart = ({ tankId }: MoeHistoryChartProps) => {
  const t = useTranslations('marks.drawer');
  const format = useFormatter();
  const { data: history = [], isPending, isError } = useMoeHistory({ tankId });

  const { dates, p65, p85, p95, p100 } = historySeries(history);

  const series: ChartSeries[] = [
    { id: 'p65', label: '65%', values: p65, tone: 'steel' },
    { id: 'p85', label: '85%', values: p85, tone: 'good' },
    { id: 'p95', label: '95%', values: p95, tone: 'accent' },
    ...(p100.length === dates.length ? [{ id: 'p100', label: '100%', values: p100, tone: 'unicum' as const }] : [])
  ];

  return match({ isPending, hasData: !isError && dates.length > 1 })
    .with({ isPending: true }, () => <Skeleton height={MOE_LIST.historyChartHeight} width='100%' />)
    .with({ hasData: true }, () => (
      <LineChart
        ariaLabel={t('historyAria')}
        formatValue={(value) => format.number(value)}
        height={MOE_LIST.historyChartHeight}
        labels={dates.map((date) => format.dateTime(new Date(date), { day: 'numeric', month: 'short' }))}
        series={series}
      />
    ))
    .otherwise(() => <EmptyState description={t('noHistoryHint')} icon={<LineChartIcon size={24} />} title={t('noHistory')} />);
};
