'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { AnalyticsFiltersProvider } from '../../model/context';
import { AnalyticsToolbar, BattlesTab } from '../components';

import s from './MyBattlesPage.module.scss';

export const MyBattlesPage = () => {
  const t = useTranslations('analytics.battlesPage');

  return (
    <AnalyticsFiltersProvider>
      <div className={s.root}>
        <SectionHeader action={<AnalyticsToolbar isPeriodVisible={false} />} as='h2' description={t('description')} title={t('title')} />
        <BattlesTab />
      </div>
    </AnalyticsFiltersProvider>
  );
};
