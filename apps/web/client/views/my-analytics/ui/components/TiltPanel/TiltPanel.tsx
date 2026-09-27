'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, KeyFigure, KeyFigures, ProgressBar } from '@/ui-kit';

import type { TiltPanelProps } from './TiltPanel.types';

import { useTiltPanel } from '../../../model/hooks';

import s from './TiltPanel.module.scss';

export const TiltPanel = ({ tilt }: TiltPanelProps) => {
  const t = useTranslations('analytics.overview.tilt');
  const { steps, advice } = useTiltPanel(tilt);

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <div className={s.body}>
        <KeyFigures>
          <KeyFigure label={t('longest')} tone='bad' value={tilt.longestLossStreak} />
          <KeyFigure label={t('current')} tone={tilt.currentLossStreak > 0 ? 'below' : 'steel'} value={tilt.currentLossStreak} />
        </KeyFigures>
        <ul className={s.steps}>
          {steps.map((step) => (
            <li key={step.afterLosses} className={s.step}>
              <ProgressBar
                label={t(step.isOpenEnded ? 'afterLossesPlus' : 'afterLosses', { count: step.afterLosses })}
                size='sm'
                tone='accent'
                value={step.winRate ?? 0}
                valueLabel={`${step.winRateText} · ${t('battles', { count: step.battles })}`}
              />
            </li>
          ))}
        </ul>
        <p className={s.advice} data-alert={advice !== null}>
          {advice ? t('advice', advice) : t('noAdvice')}
        </p>
      </div>
    </Card>
  );
};
