'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, PageHeader } from '@/ui-kit';

import { ClanRating, ClanSearch } from './components';

import s from './ClansPage.module.scss';

export const ClansPage = () => {
  const t = useTranslations('clans.head');

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')}>
        <ClanSearch />
      </PageHeader>
      <ClanRating />
      <DataSourceNote />
    </div>
  );
};
