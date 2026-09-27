'use client';

import { useTranslations } from 'next-intl';

import { Band, QueryState } from '@/ui-kit';

import { useMarksPage } from '../model/hooks';
import { ClosestMarks, ForecastLink, MarksHead, MarksTable, MarksToolbar, MoeDrawer } from './components';

import s from './MarksPage.module.scss';

export const MarksPage = () => {
  const t = useTranslations('marks.table');
  const tCommon = useTranslations('common');
  const { rows, total, updatedAt, query, selected, isDrawerOpen, onSelect, onDrawerChange } = useMarksPage();

  return (
    <div className={s.root}>
      <MarksHead isLoading={query.isPending} total={total} updatedAt={updatedAt} />
      <Band as='div' innerClassName={s.bandInner}>
        <ClosestMarks />
        <aside className={s.rail}>
          <ForecastLink />
        </aside>
      </Band>
      <section aria-label={t('title')} className={s.main}>
        <MarksToolbar />
        <QueryState errorTitle={t('error')} query={query} skeleton={<MarksTable isLoading rows={rows} onSelect={onSelect} />}>
          <MarksTable isStale={query.isPlaceholderData} rows={rows} onSelect={onSelect} />
        </QueryState>
        <p className={s.source}>{tCommon('dataSource')}</p>
      </section>
      <MoeDrawer isOpen={isDrawerOpen} row={selected} onOpenChange={onDrawerChange} />
    </div>
  );
};
