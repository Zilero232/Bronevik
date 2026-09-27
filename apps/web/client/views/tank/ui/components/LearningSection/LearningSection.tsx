'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { LearningBadge } from '@/entities/tank/tank';
import { PlusGate } from '@/features/plus/plus-gate';
import { BarChart, Card, CardHeader, EmptyState } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { useLearningChart } from '../../../model/hooks';
import { MyPlace } from './components';

import s from './LearningSection.module.scss';

export const LearningSection = () => {
  const t = useTranslations('tank.learning');
  const format = useFormatter();
  const { hasData, difficulty, gain, windowDays, labels, series, battles } = useLearningChart();

  return (
    <Card className={s.root} id={TANK_SECTIONS.learning} padding='none'>
      <CardHeader action={difficulty ? <LearningBadge difficulty={difficulty} /> : null} className={s.header} title={t('title')} />
      {hasData ? (
        <div className={s.body}>
          <BarChart
            ariaLabel={t('chartAria')}
            formatValue={(value) => format.number(value / 100, { style: 'percent', maximumFractionDigits: 1 })}
            height={TANK_PAGE.chartHeight}
            labels={labels}
            series={series}
          />
          {gain !== null && <p className={s.gain}>{t('gain', { gain: format.number(gain, { maximumFractionDigits: 1, signDisplay: 'always' }) })}</p>}
          <PlusGate feature='analytics'>
            <MyPlace />
          </PlusGate>
        </div>
      ) : (
        <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />
      )}
      <p className={s.note}>{t('note', { battles, days: windowDays })}</p>
    </Card>
  );
};
