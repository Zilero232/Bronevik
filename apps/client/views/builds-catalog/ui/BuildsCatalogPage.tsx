'use client';

import { BUILD_USAGE } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { PageHeader } from '@/ui-kit';

import { CatalogControls, CatalogTable } from './components';

import s from './BuildsCatalogPage.module.scss';

export const BuildsCatalogPage = () => {
  const t = useTranslations('buildsCatalog');

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')} />
      <CatalogControls />
      <CatalogTable />
      <p className={s.source}>{t('source', { min: BUILD_USAGE.minSample })}</p>
    </div>
  );
};
