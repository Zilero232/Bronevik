'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { RevealSection } from '../RevealSection';
import { CohortBreakdown, PeriodSwitch, StatsTiles, TrendCharts } from './components';

import s from './ServerStats.module.scss';

export const ServerStats = () => {
  const t = useTranslations('tank.stats');

  return (
    <RevealSection id={TANK_SECTIONS.stats}>
      <SectionHeader action={<PeriodSwitch />} description={t('description')} eyebrow={t('eyebrow')} index='// 01' title={t('title')} />
      <StatsTiles />
      <div className={s.layout}>
        <CohortBreakdown />
        <TrendCharts />
      </div>
    </RevealSection>
  );
};
