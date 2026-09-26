'use client';

import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote, ErrorState, KeyFigure, PageHero, Tabs } from '@/ui-kit';

import { useBonusCodes } from '../model/hooks';
import { CodeAlert, CodeList } from './components';

import s from './CodesPage.module.scss';

export const CodesPage = () => {
  const t = useTranslations('codes');
  const codes = useBonusCodes();

  return (
    <div className={s.root}>
      <PageHero
        figures={
          !codes.isPending &&
          !codes.isError && (
            <>
              <KeyFigure label={t('head.activeFigure')} value={codes.active.length} variant='compact' />
              {codes.expiringCount !== null && <KeyFigure label={t('head.expiringFigure')} value={codes.expiringCount} variant='compact' />}
            </>
          )
        }
        art={{ kind: 'emblem', glyph: <Gift size={480} strokeWidth={1.25} /> }}
        breadcrumbs={[{ label: t('head.home'), href: ROUTES.home }, { label: t('head.title') }]}
        lead={t('head.description')}
        title={t('head.title')}
      />
      <div className={s.strip} data-theme='dark'>
        <div className={s.stripInner}>
          <CodeAlert />
        </div>
      </div>
      <div className={s.body}>
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
    </div>
  );
};
