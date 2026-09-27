'use client';

import { Warehouse } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures } from '@/ui-kit';

import { useFirstWin } from '../../../model/hooks';
import { AnalyticsState } from '../AnalyticsState';
import { FirstWinTank, ResetCountdown } from './components';

import s from './FirstWinPanel.module.scss';

export const FirstWinPanel = () => {
  const t = useTranslations('analytics.firstWin');
  const tState = useTranslations('analytics.state');
  const { data, status, isNoGarage, tanks, isRetrying, retry } = useFirstWin();

  return (
    <Card className={s.root} padding='none'>
      <CardHeader action={data && !isNoGarage && <ResetCountdown nextResetAt={data.nextResetAt} />} title={t('title')} />
      <div className={s.body}>
        <AnalyticsState
          empty={<EmptyState description={tState('noGarageText')} icon={<Warehouse size={16} />} title={tState('noGarageTitle')} />}
          isEmpty={() => isNoGarage}
          state={{ data, status, isRetrying, retry }}
        >
          {(value) => (
            <>
              <KeyFigures>
                <KeyFigure label={t('available')} tone='good' value={value.available} />
                <KeyFigure label={t('taken')} tone='steel' value={value.taken} />
              </KeyFigures>
              {tanks.length > 0 ? (
                <ul aria-label={t('tanksLabel')} className={s.list}>
                  {tanks.map((tank) => (
                    <FirstWinTank key={tank.vehicle.tankId} tank={tank} />
                  ))}
                </ul>
              ) : (
                <EmptyState isCompact title={t('empty')} />
              )}
            </>
          )}
        </AnalyticsState>
      </div>
    </Card>
  );
};
