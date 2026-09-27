'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/ui-kit';

import { useCompareIds } from '../model/hooks';
import { CompareBoard, CompareDock, ComparePresets } from './components';

import s from './CompareTanksPage.module.scss';

export const CompareTanksPage = () => {
  const t = useTranslations('tanks');
  const { ids } = useCompareIds();

  return (
    <div className={s.root}>
      <PageHeader description={t('compare.head.description')} title={t('compare.head.title')}>
        <CompareDock />
      </PageHeader>
      {ids.length > 0 ? <CompareBoard /> : <ComparePresets />}
      <p className={s.source}>{t('source')}</p>
    </div>
  );
};
