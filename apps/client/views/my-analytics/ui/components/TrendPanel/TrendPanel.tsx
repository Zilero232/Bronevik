import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, LineChart } from '@/ui-kit';

import type { TrendPanelProps } from './TrendPanel.types';

import { ANALYTICS_VIEW } from '../../../config';

import s from './TrendPanel.module.scss';

export const TrendPanel = ({ labels, winRate, damage, wn8, formatPercent, formatNumber }: TrendPanelProps) => {
  const t = useTranslations('analytics.overview.charts');

  return (
    <Card padding='none'>
      <CardHeader title={t('trendTitle')} />
      {labels.length > 1 ? (
        <div className={s.grid}>
          <div className={s.chart}>
            <span className={s.label}>{t('winRate')}</span>
            <LineChart ariaLabel={t('winRate')} formatValue={formatPercent} height={ANALYTICS_VIEW.chartHeight} labels={labels} series={winRate} />
          </div>
          <div className={s.chart}>
            <span className={s.label}>{t('avgDamage')}</span>
            <LineChart ariaLabel={t('avgDamage')} formatValue={formatNumber} height={ANALYTICS_VIEW.chartHeight} labels={labels} series={damage} />
          </div>
          <div className={s.chart}>
            <span className={s.label}>{t('wn8')}</span>
            <LineChart ariaLabel={t('wn8')} formatValue={formatNumber} height={ANALYTICS_VIEW.chartHeight} labels={labels} series={wn8} />
          </div>
        </div>
      ) : (
        <EmptyState isCompact title={t('trendEmpty')} />
      )}
    </Card>
  );
};
