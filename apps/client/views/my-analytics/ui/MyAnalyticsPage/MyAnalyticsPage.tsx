'use client';

import { useTranslations } from 'next-intl';

import { PlusBadge } from '@/features/plus/plus-gate';
import { TankPicker } from '@/features/tank/pick-tank';
import { SectionHeader, Tabs } from '@/ui-kit';

import { useMyAnalyticsPage } from '../../model/hooks';
import { AnalyticsFiltersProvider, AnalyticsTabContent, AnalyticsToolbar } from '../components';

import s from './MyAnalyticsPage.module.scss';

export const MyAnalyticsPage = () => {
  const t = useTranslations('analytics');
  const { tab, tabs, isPeriodVisible, setTab, openTank } = useMyAnalyticsPage();

  return (
    <AnalyticsFiltersProvider>
      <div className={s.root}>
        <SectionHeader
          action={<TankPicker className={s.tankPicker} placeholder={t('tank.pick')} value={null} onChange={openTank} />}
          as='h1'
          description={t('header.description')}
          title={t('header.title')}
        />
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
