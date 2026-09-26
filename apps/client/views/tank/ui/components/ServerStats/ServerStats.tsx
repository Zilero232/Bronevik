'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { useTankPeriod } from '../../../model/hooks';
import { CohortBreakdown, PeriodSwitch, ServerFigures, TrendCharts } from './components';

import s from './ServerStats.module.scss';

export const ServerStats = () => {
  const t = useTranslations('tank.stats');
  const [period] = useTankPeriod();

  return (
    <section className={s.root} id={TANK_SECTIONS.stats}>
      <Card padding='none'>
        <CardHeader action={<PeriodSwitch />} className={s.header} title={t('title', { period: t(`periods.${period}`) })} />
        <ServerFigures />
      </Card>
      <div className={s.layout}>
        <CohortBreakdown />
        <TrendCharts />
      </div>
    </section>
  );
};
