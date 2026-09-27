'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, LineChart, QueryState, Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../../../config';
import { useTrendCharts } from '../../../../../model/hooks';

import s from './TrendCharts.module.scss';

export const TrendCharts = () => {
  const t = useTranslations('tank.stats');
  const { query, formatPercent, formatDamage } = useTrendCharts();

  return (
    <Card padding='none'>
      <CardHeader className={s.header} title={t('trendTitle', { days: TANK_PAGE.trendDays })} />
      <QueryState
        empty={<EmptyState title={t('trendEmpty')} />}
        isEmpty={({ labels }) => labels.length === 0}
        query={query}
        skeleton={<Skeleton height={TANK_PAGE.chartHeight * 2} shape='block' width='100%' />}
      >
        {({ labels, winRates, damages }) => (
          <div className={s.charts}>
            <div className={s.chart}>
              <span className={s.label}>{t('trendWinRate')}</span>
              <LineChart
                hasTableToggle
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
                hasTableToggle
                ariaLabel={t('trendDamage')}
                formatValue={formatDamage}
                height={TANK_PAGE.chartHeight}
                labels={labels}
                series={[{ id: 'avgDamage', label: t('trendDamage'), values: damages, tone: 'steel' }]}
              />
            </div>
          </div>
        )}
      </QueryState>
    </Card>
  );
};
