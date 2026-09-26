'use client';

import { useTranslations } from 'next-intl';

import { ErrorState } from '@/ui-kit';

import { useMarksPage } from '../model/hooks';
import { ClosestMarks, ForecastLink, MarksHead, MarksTable, MarksToolbar, MoeDrawer } from './components';

import s from './MarksPage.module.scss';

export const MarksPage = () => {
  const t = useTranslations('marks.table');
  const tCommon = useTranslations('common');
  const { rows, total, updatedAt, isPending, isError, isRetrying, isStale, refetch, selected, isDrawerOpen, onSelect, onDrawerChange } =
    useMarksPage();

  return (
    <div className={s.root}>
      <MarksHead isLoading={isPending} total={total} updatedAt={updatedAt} />
      <div className={s.layout}>
        <section aria-label={t('title')} className={s.main}>
          <MarksToolbar />
          {isError ? (
            <ErrorState isRetrying={isRetrying} title={t('error')} onRetry={() => void refetch()} />
          ) : (
            <MarksTable isLoading={isPending} isStale={isStale} rows={rows} onSelect={onSelect} />
          )}
          <p className={s.source}>{tCommon('dataSource')}</p>
        </section>
        <aside className={s.rail}>
          <ClosestMarks />
          <ForecastLink />
        </aside>
      </div>
      <MoeDrawer isOpen={isDrawerOpen} row={selected} onOpenChange={onDrawerChange} />
    </div>
  );
};
