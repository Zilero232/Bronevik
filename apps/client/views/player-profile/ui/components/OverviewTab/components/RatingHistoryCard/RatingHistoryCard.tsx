'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { LineChart, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { usePlayerHistory } from '../../../../../model/hooks';
import { TabCard } from '../../../TabCard';
import { TabState } from '../../../TabState';

const CHART_HEIGHT = 260;

export const RatingHistoryCard = () => {
  const t = useTranslations('profile.overview');
  const format = useFormatter();
  const { data: history, isPending, isError } = usePlayerHistory({ metric: OVERVIEW.historyMetric, granularity: OVERVIEW.historyGranularity });

  const points = history?.points.slice(-OVERVIEW.historyPoints).filter(({ value }) => value !== null) ?? [];

  return (
    <TabCard eyebrow={t('historyEyebrow')} title={t('historyTitle')}>
      {isPending && <Skeleton height={CHART_HEIGHT} shape='block' />}
      {isError && <TabState kind='error' />}
      {!isPending && !isError && points.length === 0 && <TabState kind='empty' />}
      {!isPending && !isError && points.length > 0 && (
        <LineChart
          withArea
          ariaLabel={t('historyTitle')}
          formatValue={(value) => format.number(value, { maximumFractionDigits: 0, useGrouping: false })}
          height={CHART_HEIGHT}
          labels={points.map(({ at }) => format.dateTime(new Date(at), { day: 'numeric', month: 'short' }))}
          series={[{ id: 'wn8', label: 'WN8', values: points.map(({ value }) => value ?? 0), tone: 'accent' }]}
        />
      )}
    </TabCard>
  );
};
