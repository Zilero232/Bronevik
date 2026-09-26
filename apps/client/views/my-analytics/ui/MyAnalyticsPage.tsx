'use client';

import { useTranslations } from 'next-intl';

import { PlusBadge } from '@/features/plus/plus-gate';
import { SectionHeader, Tabs } from '@/ui-kit';

import { AnalyticsFiltersProvider } from '../model/context';
import { useMyAnalyticsPage } from '../model/hooks';
import { AnalyticsTabContent, AnalyticsToolbar } from './components';

import s from './MyAnalyticsPage.module.scss';

export const MyAnalyticsPage = () => {
  const t = useTranslations('analytics');
  const { tab, tabs, isPeriodVisible, setTab } = useMyAnalyticsPage();

  return (
    <AnalyticsFiltersProvider>
      <div className={s.root}>
        <SectionHeader as='h2' description={t('header.description')} title={t('header.title')} />
        <Tabs
          items={tabs.map(({ value, isLocked }) => ({
            value,
            label: (
              <span className={s.tab}>
                {t(`tabs.${value}`)}
                {isLocked && <PlusBadge />}
              </span>
            ),
            content: <AnalyticsTabContent tab={value} />
          }))}
          aside={<AnalyticsToolbar isPeriodVisible={isPeriodVisible} />}
          value={tab}
          variant='strip'
          onValueChange={setTab}
        />
      </div>
    </AnalyticsFiltersProvider>
  );
};
