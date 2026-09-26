'use client';

import { useTranslations } from 'next-intl';

import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { PageHeader } from '@/ui-kit';

import { RecentSearches, StatusPanel } from './components';

import s from './HomeHead.module.scss';

export const HomeHead = () => {
  const t = useTranslations('home.head');

  return (
    <PageHeader aside={<StatusPanel />} description={t('description')} title={t('title')}>
      <div className={s.search}>
        <CommandPaletteTrigger variant='hero' />
        <RecentSearches />
      </div>
    </PageHeader>
  );
};
