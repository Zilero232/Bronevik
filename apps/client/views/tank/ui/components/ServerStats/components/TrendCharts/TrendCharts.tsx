'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { AreaChart, Badge, Card, CardHeader, LineChart, Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../../../config';
import { useTankTrend } from '../../../../../model/hooks';
import { SectionNotice } from '../../../SectionNotice';

import s from './TrendCharts.module.scss';

const CHART_HEIGHT = 200;

export const TrendCharts = () => {
  const t = useTranslations('tank.stats');
  const format = useFormatter();
  const { data: trend, isPending, isError } = useTankTrend();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader
        action={<Badge tone='steel'>{t('trendWindow', { days: TANK_PAGE.trendDays })}</Badge>}
        eyebrow={t('trendEyebrow')}
        title={t('trendTitle')}
      />
      {match({ points: trend ?? [], isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={CHART_HEIGHT * 2} shape='block' width='100%' />)
        .with({ isError: true }, () => <SectionNotice kind='error' />)
        .with({ points: [] }, () => <SectionNotice kind='empty' />)
        .otherwise(({ points: all }) => {
          const points = all.flatMap(({ date, winRate, avgDamage }) =>
            winRate === null || avgDamage === null ? [] : [{ date, winRate, avgDamage }]
          );

          const labels = points.map(({ date }) => format.dateTime(parseISO(date), { day: 'numeric', month: 'short' }));

          return (
            <div className={s.charts}>
              <div className={s.chart}>
                <span className={s.label}>{t('trendWinRate')}</span>
                <AreaChart
                  ariaLabel={t('trendWinRate')}
                  formatValue={(value) => `${format.number(value, { maximumFractionDigits: 1 })}%`}
                  height={CHART_HEIGHT}
                  labels={labels}
                  series={[{ id: 'winRate', label: t('trendWinRate'), values: points.map(({ winRate }) => winRate), tone: 'steel' }]}
                />
              </div>
              <div className={s.chart}>
                <span className={s.label}>{t('trendDamage')}</span>
                <LineChart
                  withArea
                  ariaLabel={t('trendDamage')}
                  formatValue={(value) => format.number(value, { maximumFractionDigits: 0 })}
                  height={CHART_HEIGHT}
                  labels={labels}
                  series={[{ id: 'avgDamage', label: t('trendDamage'), values: points.map(({ avgDamage }) => avgDamage), tone: 'accent' }]}
                />
              </div>
            </div>
          );
        })}
    </Card>
  );
};
