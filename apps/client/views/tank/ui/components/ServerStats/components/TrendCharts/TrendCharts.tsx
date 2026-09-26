'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Card, CardHeader, EmptyState, ErrorState, LineChart, Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../../../config';
import { useTrendCharts } from '../../../../../model/hooks';

import s from './TrendCharts.module.scss';

export const TrendCharts = () => {
  const t = useTranslations('tank.stats');
  const { labels, winRates, damages, isEmpty, isPending, isError, refetch, formatPercent, formatDamage } = useTrendCharts();

  return (
    <Card padding='none'>
      <CardHeader className={s.header} title={t('trendTitle', { days: TANK_PAGE.trendDays })} />
      {match({ isPending, isError, isEmpty })
        .with({ isPending: true }, () => <Skeleton height={TANK_PAGE.chartHeight * 2} shape='block' width='100%' />)
        .with({ isError: true }, () => <ErrorState onRetry={() => void refetch()} />)
        .with({ isEmpty: true }, () => <EmptyState title={t('trendEmpty')} />)
        .otherwise(() => (
          <div className={s.charts}>
            <div className={s.chart}>
              <span className={s.label}>{t('trendWinRate')}</span>
              <LineChart
                ariaLabel={t('trendWinRate')}
                formatValue={formatPercent}
                height={TANK_PAGE.chartHeight}
                labels={labels}
                series={[{ id: 'winRate', label: t('trendWinRate'), values: winRates, tone: 'accent' }]}
              />
            </div>
            <div className={s.chart}>
              <span className={s.label}>{t('trendDamage')}</span>
              <LineChart
                ariaLabel={t('trendDamage')}
                formatValue={formatDamage}
                height={TANK_PAGE.chartHeight}
                labels={labels}
                series={[{ id: 'avgDamage', label: t('trendDamage'), values: damages, tone: 'steel' }]}
              />
            </div>
          </div>
        ))}
    </Card>
  );
};
