'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/ui-kit';

import { NationSelector, TreeExplorer } from './components';

import s from './TreePage.module.scss';

export const TreePage = () => {
  const t = useTranslations('tree.head');

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')}>
        <NationSelector />
      </PageHeader>
      <TreeExplorer />
    </div>
  );
};
