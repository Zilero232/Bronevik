'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, ErrorState, PageHeader, Tabs } from '@/ui-kit';

import { useBonusCodes } from '../model/hooks';
import { CodeList } from './components';

import s from './CodesPage.module.scss';

export const CodesPage = () => {
  const t = useTranslations('codes');
  const codes = useBonusCodes();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')} />
      {codes.isError ? (
        <ErrorState description={t('error.description')} isRetrying={codes.isRetrying} title={t('error.title')} onRetry={codes.retry} />
      ) : (
        <Tabs
          items={[
            {
              value: 'active',
              label: t('tabs.active'),
              count: codes.isPending ? undefined : codes.active.length,
              content: <CodeList codes={codes.active} emptyTitle={t('empty.active')} isPending={codes.isPending} />
            },
            {
              value: 'expired',
              label: t('tabs.expired'),
              count: codes.isPending ? undefined : codes.expired.length,
              content: <CodeList codes={codes.expired} emptyTitle={t('empty.expired')} isPending={codes.isPending} />
            }
          ]}
          value={codes.tab}
          variant='panel'
          onValueChange={codes.setTab}
        />
      )}
      <DataSourceNote />
    </div>
  );
};
