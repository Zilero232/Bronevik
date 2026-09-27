'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState, KeyFigure, KeyFigures } from '@/ui-kit';

import { useAnalyticsPlatoons } from '../../../model/hooks';
import { AnalyticsState } from '../AnalyticsState';

import s from './PlatoonTab.module.scss';

export const PlatoonTab = () => {
  const t = useTranslations('analytics.platoon');
  const platoons = useAnalyticsPlatoons();

  return (
    <AnalyticsState
      empty={<EmptyState description={t('untrackedText')} icon={<Users size={16} />} title={t('untrackedTitle')} />}
      feature='mapAdvisor'
      isEmpty={() => platoons.isUntracked}
      state={platoons}
    >
      {(data) => (
        <div className={s.root}>
          <KeyFigures>
            <KeyFigure label={t('soloBattles')} tone='steel' value={data.solo.battles} />
            <KeyFigure format={{ maximumFractionDigits: 2 }} label={t('soloWinRate')} suffix='%' tone='steel' value={data.solo.winRate} />
            <KeyFigure label={t('platoonBattles')} value={data.platoon.battles} />
            <KeyFigure format={{ maximumFractionDigits: 2 }} label={t('platoonWinRate')} suffix='%' value={data.platoon.winRate} />
            <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('platoonDamage')} tone='steel' value={data.platoon.avgDamage} />
          </KeyFigures>
          <p className={s.source}>{t('tracked', { count: data.tracked })}</p>
          <Card padding='none'>
            <CardHeader meta={t('matesDescription')} title={t('matesTitle')} />
            <DataTable
              caption={t('matesTitle')}
              columns={platoons.columns}
              data={data.mates}
              density='compact'
              emptyState={<EmptyState isCompact title={t('matesEmpty')} />}
              getRowId={(row) => String(row.accountId)}
              initialSorting={[{ id: 'battles', desc: true }]}
            />
          </Card>
        </div>
      )}
    </AnalyticsState>
  );
};
