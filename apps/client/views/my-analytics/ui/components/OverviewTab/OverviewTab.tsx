'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure, KeyFigures } from '@/ui-kit';

import { useAnalyticsOverview } from '../../../model/hooks';
import { ActivityCharts } from '../ActivityCharts';
import { AnalyticsState } from '../AnalyticsState';
import { BreakdownPanel } from '../BreakdownPanel';
import { ModEmptyState } from '../ModEmptyState';
import { SessionsTable } from '../SessionsTable';
import { TiltPanel } from '../TiltPanel';
import { TrendPanel } from '../TrendPanel';

import s from './OverviewTab.module.scss';

export const OverviewTab = () => {
  const t = useTranslations('analytics.overview');
  const overview = useAnalyticsOverview();

  return (
    <AnalyticsState empty={<ModEmptyState />} isEmpty={() => overview.isEmpty} state={overview}>
      {(data) => (
        <div className={s.root}>
          <KeyFigures>
            <KeyFigure label={t('totals.battles')} tone='steel' value={data.totals.battles} />
            <KeyFigure
              format={{ maximumFractionDigits: 2 }}
              label={t('totals.winRate')}
              suffix='%'
              tone={overview.tones.winRate}
              value={data.totals.winRate}
            />
            <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('totals.avgDamage')} tone='steel' value={data.totals.avgDamage} />
            <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('totals.wn8')} tone={overview.tones.wn8} value={data.totals.wn8} />
            <KeyFigure
              format={{ maximumFractionDigits: 1 }}
              label={t('totals.survivalRate')}
              suffix='%'
              tone='steel'
              value={data.totals.survivalRate}
            />
          </KeyFigures>
          <p className={s.source}>{t('source', { count: data.modBattles })}</p>
          <div className={s.grid}>
            <BreakdownPanel breakdown={data.breakdown} />
            <TiltPanel tilt={data.tilt} />
          </div>
          <ActivityCharts formatPercent={overview.formatPercent} hours={overview.hourChart} weekdays={overview.weekdayChart} />
          <TrendPanel
            damage={overview.damageSeries}
            formatNumber={overview.formatNumber}
            formatPercent={overview.formatPercent}
            labels={overview.trendLabels}
            winRate={overview.winRateSeries}
            wn8={overview.wn8Series}
          />
          <SessionsTable sessions={data.sessions} />
        </div>
      )}
    </AnalyticsState>
  );
};
